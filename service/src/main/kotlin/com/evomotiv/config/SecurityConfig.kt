package com.evomotiv.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.core.OAuth2Error
import org.springframework.security.oauth2.core.OAuth2TokenValidator
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.jwt.JwtValidators
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.context.annotation.RequestScope
import org.springframework.web.servlet.support.ServletUriComponentsBuilder

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {
    /* Explicitly add the endpoints to secure here. Rule of thumb for this PoC:
    All GET methods need ROLE_USER. Adding workbenches etc. need ROLE_ADMIN
    (Spring adds the prefix "ROLE_" automatically)
    The rest will be denied, except for documentation
    */
    val userAuthorizedEndpoints = arrayOf(
        "/api/dashboard/**",
        "/api/workbenches/**",
        "/api/load-carriers/**",
        "/api/requests/**",
        "/api/anomalies/**",
    )

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private lateinit var issuerUri: String

    @Value("\${carrier-hub.security.client-id}")
    private lateinit var clientId: String

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors(Customizer.withDefaults())
            .authorizeHttpRequests {
                it
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
                    .requestMatchers(HttpMethod.GET, *userAuthorizedEndpoints).hasAnyRole("USER", "ADMIN")
                    .requestMatchers("/api/**").hasRole("ADMIN")
                    .anyRequest().denyAll()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt ->
                    jwt.decoder(jwtDecoder())
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                }
            }

        return http.build()
    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val decoder = JwtDecoders.fromIssuerLocation(issuerUri) as NimbusJwtDecoder

        // Combine default issuer validator with our custom audience validator
        val defaultValidator = JwtValidators.createDefaultWithIssuer(issuerUri)
        val audienceValidator = audienceValidator()

        val combinedValidator = OAuth2TokenValidator<Jwt> { token ->
            val defaultResult = defaultValidator.validate(token)
            val audienceResult = audienceValidator.validate(token)

            val errors = (defaultResult.errors + audienceResult.errors).toMutableList()
            if (errors.isEmpty()) OAuth2TokenValidatorResult.success()
            else OAuth2TokenValidatorResult.failure(errors)
        }

        decoder.setJwtValidator(combinedValidator)
        return decoder
    }

    private fun audienceValidator(): OAuth2TokenValidator<Jwt> {
        // verify that the aud claim matches KC_BACKEND_CLIENT_ID
        return OAuth2TokenValidator { jwt ->
            val audiences = jwt.audience
            if (audiences.contains(clientId)) {
                OAuth2TokenValidatorResult.success()
            } else {
                OAuth2TokenValidatorResult.failure(
                    OAuth2Error("invalid_token", "Token missing required audience.", null) // this error should not be so verbose
                )
            }
        }
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter { jwt ->
            val authorities = mutableListOf<GrantedAuthority>()

            // "scope" claim is space-separated
            jwt.getClaimAsString("scope")?.split(" ")?.forEach { scope ->
                authorities.add(SimpleGrantedAuthority("SCOPE_$scope"))
            }

            // Keycloak client roles live at resource_access.<KC_BACKEND_CLIENT_ID>.roles
            @Suppress("UNCHECKED_CAST") // this is ugly
            val resourceAccess = jwt.getClaim<Map<String, Any>>("resource_access")
            val clientAccess = resourceAccess?.get(clientId) as? Map<*, *>
            val clientRoles = clientAccess?.get("roles") as? List<*>
            clientRoles?.filterIsInstance<String>()?.forEach { role ->
                authorities.add(SimpleGrantedAuthority("ROLE_$role"))
            }

            authorities
        }
        return converter
    }

    @Bean
    @RequestScope
    fun urlBuilder(): ServletUriComponentsBuilder {
        return ServletUriComponentsBuilder.fromCurrentRequest()
    }
}
package com.evomotiv.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.context.annotation.RequestScope
import org.springframework.web.servlet.support.ServletUriComponentsBuilder


@Configuration
@EnableWebSecurity(debug = true)
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

    @Value("\${AZURE_TENANT_ID}")
    private lateinit var tenantId: String
    
    @Value("\${AZURE_BACKEND_CLIENT_ID}")
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
            .oauth2ResourceServer { it.jwt(Customizer.withDefaults()) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
         
        return http.build()
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter { jwt ->
            val authorities = mutableListOf<GrantedAuthority>()

            // Extract scopes - these confirm the app has API access
            jwt.getClaimAsString("scp")?.split(" ")?.forEach { scope ->
                authorities.add(SimpleGrantedAuthority("SCOPE_$scope"))
            }

            // Extract role and prefix "ROLE_" as needed by spring security
            val roles = jwt.getClaimAsStringList("roles") ?: emptyList()
            roles.forEach { role ->
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
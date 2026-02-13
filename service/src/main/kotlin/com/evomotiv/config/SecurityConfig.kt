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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
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

    @Value("\${TENANT_ID}")
    private lateinit var tenantId: String
    
    @Value("\${CLIENT_ID}")
    private lateinit var clientId: String

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors(Customizer.withDefaults())
            .authorizeHttpRequests {
                it
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
                    .requestMatchers(HttpMethod.GET, *userAuthorizedEndpoints).hasRole("USER")
                    .requestMatchers("/api/**").hasRole("ADMIN")
                    .anyRequest().denyAll()
            }.oauth2ResourceServer { it.jwt(Customizer.withDefaults())
            }.sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }.cors(Customizer.withDefaults())
         
            return http.build()
        }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val grantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter().apply {
            // Remove the SCOPE_ prefix
            setAuthorityPrefix("")
            // Look for scopes in the "scp" claim (default for Entra ID)
            setAuthoritiesClaimName("scp")
        }

        return JwtAuthenticationConverter().apply {
            setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter)
        }
    }

    @Bean
    @RequestScope
    fun urlBuilder(): ServletUriComponentsBuilder {
        return ServletUriComponentsBuilder.fromCurrentRequest()
    }
}
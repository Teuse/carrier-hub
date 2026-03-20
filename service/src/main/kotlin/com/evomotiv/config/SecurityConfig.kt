package com.evomotiv.config

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletResponse
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
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.context.annotation.RequestScope
import org.springframework.web.servlet.support.ServletUriComponentsBuilder

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(private val objectMapper: ObjectMapper) {

    val userAuthorizedEndpoints = arrayOf(
        "/api/dashboard/**",
        "/api/workspaces/**",
        "/api/load-carriers/**",
        "/api/requests/**",
        "/api/anomalies/**",
    )

    @Value("\${AZURE_TENANT_ID}")
    private lateinit var tenantId: String

    @Value("\${AZURE_BACKEND_CLIENT_ID}")
    private lateinit var clientId: String

    @Value("\${GRAPH_SUBSCRIPTION_CLIENT_STATE}")
    private lateinit var graphClientState: String

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors(Customizer.withDefaults())
            .csrf { it.disable() }
            .addFilterBefore(
                GraphClientStateFilter(graphClientState, objectMapper),
                UsernamePasswordAuthenticationFilter::class.java
            )
            .authorizeHttpRequests {
                it
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/health", "/error").permitAll()
                    // Graph API hits this endpoint without a Bearer token.
                    // Security is handled by GraphClientStateFilter (POST) and validationToken echo (GET).
                    .requestMatchers("/api/graph/notifications").permitAll()
                    .requestMatchers(HttpMethod.GET, *userAuthorizedEndpoints).hasAnyRole("USER", "ADMIN")
                    .requestMatchers("/api/**").hasRole("ADMIN")
                    .anyRequest().denyAll()
            }
            .oauth2ResourceServer {
                it.jwt(Customizer.withDefaults())
                // for debugging
                it.authenticationEntryPoint(AuthenticationEntryPoint { request, response, ex ->
                    val log = org.slf4j.LoggerFactory.getLogger("SecurityEntryPoint")
                    log.error("Auth entry point triggered for ${request.method} ${request.requestURI}: ${ex.message}", ex)
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.message)
                })
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }

        return http.build()
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter { jwt ->
            val authorities = mutableListOf<GrantedAuthority>()

            jwt.getClaimAsString("scp")?.split(" ")?.forEach { scope ->
                authorities.add(SimpleGrantedAuthority("SCOPE_$scope"))
            }

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
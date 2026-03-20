package com.evomotiv.config

import com.azure.identity.ClientSecretCredentialBuilder
import com.azure.identity.OnBehalfOfCredentialBuilder
import com.microsoft.graph.serviceclient.GraphServiceClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Scope
import org.springframework.context.annotation.ScopedProxyMode
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.context.WebApplicationContext

@Configuration
class GraphClientConfig {

    @Value("\${AZURE_TENANT_ID}")
    lateinit var tenantId: String

    @Value("\${AZURE_BACKEND_CLIENT_ID}")
    lateinit var clientId: String

    @Value("\${AZURE_BACKEND_CLIENT_SECRET}")
    lateinit var clientSecret: String

    /**
     * For app-only calls, e.g. webhook usage (client-credential flow).
     */
    @Bean
    fun appGraphServiceClient(): GraphServiceClient {
        val credential = ClientSecretCredentialBuilder()
            .clientId(clientId)
            .clientSecret(clientSecret)
            .tenantId(tenantId)
            .build()

        return GraphServiceClient(credential, "https://graph.microsoft.com/.default")
    }

    /**
     * For calls of graph endpoints as part of OBO (on-behalf-of) flow,
     * i.e. a signed-in user (delegated). Unsure if needed in the future.
     */
    @Bean
    @Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
    fun delegatedGraphServiceClient(): GraphServiceClient {
        val auth = SecurityContextHolder.getContext().authentication as? JwtAuthenticationToken
            ?: throw IllegalStateException("No JWT authentication found in security context")

        val credential = OnBehalfOfCredentialBuilder()
            .clientId(clientId)
            .clientSecret(clientSecret)
            .tenantId(tenantId)
            .userAssertion(auth.token.tokenValue)
            .build()

        return GraphServiceClient(credential, "https://graph.microsoft.com/.default")
    }
}
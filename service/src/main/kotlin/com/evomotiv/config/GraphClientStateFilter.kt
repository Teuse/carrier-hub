package com.evomotiv.config

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpMethod
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.ContentCachingRequestWrapper

class GraphClientStateFilter(
    private val expectedClientState: String,
    private val objectMapper: ObjectMapper
) : OncePerRequestFilter() {

    private val log = LoggerFactory.getLogger(javaClass)

    // Only apply this filter to the Graph notification endpoint
    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        if (request.requestURI != "/api/graph/notifications") return true
        if (request.method != HttpMethod.POST.name()) return true
        // Graph sends the validation handshake as a POST with validationToken as a query param
        // and no body — skip clientState check, let the controller handle it
        if (request.getParameter("validationToken") != null) return true
        return false
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain
    ) {
        // Wrap so the body can be read here AND again later in the controller
        val wrappedRequest = ContentCachingRequestWrapper(request)

        // Reading through the wrapper's InputStream causes it to cache the bytes
        // internally — the controller can then re-read via getContentAsByteArray()
        val payload = runCatching {
            objectMapper.readValue(wrappedRequest.inputStream, Map::class.java)
        }.getOrNull()

        val values = payload?.get("value") as? List<*>
        val allValid = values?.all { notification ->
            val notif = notification as? Map<*, *>
            notif?.get("clientState") == expectedClientState
        } ?: false

        if (!allValid) {
            log.warn("Graph notification rejected: clientState mismatch")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid clientState")
            return
        }

        chain.doFilter(wrappedRequest, response)
    }
}
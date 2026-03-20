package com.evomotiv.controller

import org.slf4j.LoggerFactory
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
@RestController
@RequestMapping("/api/graph")
class GraphNotificationController {

    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Validation handshake — called by Graph when a subscription is created or renewed.
     * Graph sends this as either GET or POST with validationToken as a query param.
     * Must echo back the validationToken as plain text within 10 seconds.
     */
    @RequestMapping("/notifications", method = [RequestMethod.GET, RequestMethod.POST], params = ["validationToken"])
    fun validateSubscription(
        @RequestParam("validationToken") validationToken: String
    ): ResponseEntity<String> {
        log.info("Graph subscription validation handshake received")
        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body(validationToken)
    }

    /**
     * Receives ongoing change notifications from Graph.
     * By the time this is reached, clientState has already been validated
     * by GraphClientStateFilter — no security logic needed here.
     *
     * Always return 202 Accepted quickly and process asynchronously.
     */
    @PostMapping("/notifications", params = ["!validationToken"])
    fun receiveNotification(@RequestBody payload: Map<String, Any>): ResponseEntity<Void> {
        val values = payload["value"] as? List<*> ?: return ResponseEntity.accepted().build()

        for (notification in values) {
            val notif = notification as? Map<*, *> ?: continue
            val changeType = notif["changeType"]
            val resourceId = notif["resourceData"]?.let { (it as? Map<*, *>)?.get("id") }
            log.info("Graph notification: changeType=$changeType, resourceId=$resourceId")
            // TODO: publish to internal event queue for async processing
        }

        return ResponseEntity.accepted().build()
    }
}
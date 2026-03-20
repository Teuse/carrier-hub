package com.evomotiv.service

import com.microsoft.graph.models.Subscription
import com.microsoft.graph.serviceclient.GraphServiceClient
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
@EnableScheduling
class GraphApiSubscriptionService(
    private val appGraphServiceClient: GraphServiceClient
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Value("\${GRAPH_NOTIFICATION_URL}")
    private lateinit var notificationUrl: String

    @Value("\${GRAPH_SUBSCRIPTION_CLIENT_STATE}")
    private lateinit var clientState: String

    private var subscriptionId: String? = null

    /**
     * Create the subscription after the server is fully started and listening.
     * Using ApplicationReadyEvent instead of @PostConstruct ensures Tomcat is
     * already accepting connections when Graph fires the validation handshake.
     */
    @EventListener(ApplicationReadyEvent::class)
    fun createSubscription() {
        val subscription = Subscription().apply {
            changeType = "created,updated,deleted"
            notificationUrl = this@GraphApiSubscriptionService.notificationUrl
            resource = "/users/971099f285185b91"
            expirationDateTime = OffsetDateTime.now().plusDays(6)
            clientState = this@GraphApiSubscriptionService.clientState
        }

        val created = appGraphServiceClient.subscriptions().post(subscription)
        // TODO: Persist created in DB with my new repo

        subscriptionId = created?.id
        log.info("Graph subscription created: id=${subscriptionId}, expires=${created?.expirationDateTime}")
    }

    /**
     * Renew the subscription every 7 days so it never expires.
     * In production, consider storing the subscriptionId and expiry in a DB
     * so it survives restarts.
     */
    @Scheduled(fixedDelay = 6L * 24 * 60 * 60 * 1000)
    fun renewSubscription() {
        val id = subscriptionId ?: run {
            log.warn("No subscription ID to renew — recreating")
            createSubscription()
            return
        }

        val patch = Subscription().apply {
            expirationDateTime = OffsetDateTime.now().plusDays(29)
        }

        appGraphServiceClient.subscriptions().bySubscriptionId(id).patch(patch)
        log.info("Graph subscription renewed: id=$id")
    }
}
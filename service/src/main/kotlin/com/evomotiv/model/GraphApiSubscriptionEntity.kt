package com.evomotiv.model

import com.microsoft.graph.models.Subscription
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime

@Entity
@Table(name = "graph_api_sub")
class GraphApiSubscriptionEntity (
    @Id
    var id: String,

    @Column(name = "application_id")
    var applicationId: String,

    @Column(name = "change_type")
    var changeType: String,

    @Column(name = "client_state")
    var clientState: String,

    @Column(name = "creator_id")
    var creatorId: String,

    @Column(name = "encryption_certificate")
    var encryptionCertificate: String,

    @Column(name = "encryption_certificate_id")
    var encryptionCertificateId: String,

    @Column(name = "expiration_date_time")
    var expirationDateTime: OffsetDateTime,

    @Column(name = "include_resource_data")
    var includeResourceData: Boolean,

    @Column(name = "latest_supported_tls_version")
    var latestSupportedTlsVersion: String,

    @Column(name = "lifecycle_notification_url")
    var lifecycleNotificationUrl: String,

    @Column(name = "notification_query_options")
    var notificationQueryOptions: String,

    @Column(name = "notification_url")
    var notificationUrl: String,

    @Column(name = "notification_url_app_id")
    var notificationUrlAppId: String,

    @Column(name = "resource")
    var resource: String,
) {
    companion object {
        fun fromSubscription(sub: Subscription): GraphApiSubscriptionEntity {
            return GraphApiSubscriptionEntity(
                id = sub.id,
                applicationId = sub.applicationId,
                changeType = sub.changeType,
                clientState = sub.clientState,
                creatorId = sub.creatorId,
                encryptionCertificate = sub.encryptionCertificate,
                encryptionCertificateId = sub.encryptionCertificateId,
                expirationDateTime = sub.expirationDateTime,
                includeResourceData = sub.includeResourceData,
                latestSupportedTlsVersion = sub.latestSupportedTlsVersion,
                lifecycleNotificationUrl = sub.lifecycleNotificationUrl,
                notificationQueryOptions = sub.notificationQueryOptions,
                notificationUrl = sub.notificationUrl,
                notificationUrlAppId = sub.notificationUrlAppId,
                resource = sub.resource
            )
        }
    }

    fun toSubscription(): Subscription {
        val sub = Subscription()
        sub.id = this.id
        sub.applicationId = this.applicationId
        sub.changeType = this.changeType
        sub.clientState = this.clientState
        sub.creatorId = this.creatorId
        sub.encryptionCertificate = this.encryptionCertificate
        sub.encryptionCertificateId = this.encryptionCertificateId
        sub.expirationDateTime = this.expirationDateTime
        sub.includeResourceData = this.includeResourceData
        sub.latestSupportedTlsVersion = this.latestSupportedTlsVersion
        sub.lifecycleNotificationUrl = this.lifecycleNotificationUrl
        sub.notificationQueryOptions = this.notificationQueryOptions
        sub.notificationUrl = this.notificationUrl
        sub.notificationUrlAppId = this.notificationUrlAppId
        sub.resource = this.resource
        return sub
    }
}
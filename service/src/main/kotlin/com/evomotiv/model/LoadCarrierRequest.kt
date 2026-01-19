package com.evomotiv.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "load_carrier_request")
class LoadCarrierRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "workbench_id", nullable = false)
    val workbench: Workbench,

    /* ===================== */
    /* Requested Load Carrier */
    /* ===================== */

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "load_carrier_id", nullable = false)
    val loadCarrier: LoadCarrier,

    /* ===================== */
    /* Request Meta Data     */
    /* ===================== */

    @Column(length = 1024)
    var comment: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var priority: RequestPriority = RequestPriority.NORMAL,

    /* ===================== */
    /* Status + Timestamps   */
    /* ===================== */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: LoadCarrierRequestStatus = LoadCarrierRequestStatus.REQUESTED,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "delivered_at")
    var deliveredAt: Instant? = null,
)
package com.evomotiv.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "load_carrier_request")
class LoadCarrierRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(optional = false)
    @JoinColumn(name = "workbench_id")
    val workbench: Workbench,

    /* ===================== */
    /* Request Meta Data     */
    /* ===================== */

    @Column(nullable = false)
    var name: String,

    @Column(length = 1024)
    var description: String? = null,

    @Column(length = 1024)
    var comment: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var priority: RequestPriority = RequestPriority.NORMAL,

    /* ===================== */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: LoadCarrierRequestStatus = LoadCarrierRequestStatus.REQUESTED,

    @Column(nullable = false)
    val createdAt: Instant = Instant.now(),

    var deliveredAt: Instant? = null,
)
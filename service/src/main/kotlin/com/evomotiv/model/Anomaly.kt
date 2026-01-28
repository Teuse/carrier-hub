package com.evomotiv.model


import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "anomaly")
class Anomaly (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    var van: String? = null,
    var pn: String? = null,
    var kz: String? = null,
    var notes: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workbench_id", nullable = false)
    var workbench: Workbench,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: AnomalyStatus = AnomalyStatus.REPORTED,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "delivered_at")
    var updatedAt: Instant? = null,
)
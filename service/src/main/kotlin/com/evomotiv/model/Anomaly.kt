package com.evomotiv.model


import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "anomaly")
data class Anomaly (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    var van: String? = null,
    var pn: String? = null,
    var kz: String? = null,
    var notes: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    var workspace: Workspace,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: AnomalyStatus = AnomalyStatus.REPORTED,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(name = "sharepoint_item_id")
    var sharepointItemId: String? = null,

    @Column(name = "created_by")
    var createdBy: String? = null,

    @Column(name = "reviewed_by")
    var reviewedBy: String? = null
)
package com.evomotiv.model

import jakarta.persistence.*

@Entity
@Table(
    name = "workspace",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["name"])
    ]
)
data class Workspace(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    var description: String? = null,

    @OneToMany(
        mappedBy = "workspace",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val anomalies: MutableList<Anomaly> = mutableListOf()
)
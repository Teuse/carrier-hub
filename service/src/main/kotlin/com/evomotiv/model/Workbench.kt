package com.evomotiv.model

import jakarta.persistence.*

@Entity
@Table(
    name = "workbench",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["name"])
    ]
)
data class Workbench(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String,

    val description: String? = null,
    val active: Boolean = true,

    @OneToMany(
        mappedBy = "workbench",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val anomalies: MutableList<Anomaly> = mutableListOf()
)
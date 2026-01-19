package com.evomotiv.model

import jakarta.persistence.*

@Entity
@Table(name = "item")
class Item(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "load_carrier_id", nullable = false)
    var loadCarrier: LoadCarrier,

    @Column(nullable = false)
    var name: String,

    var description: String? = null,

    @Column(nullable = false)
    var count: Int
)
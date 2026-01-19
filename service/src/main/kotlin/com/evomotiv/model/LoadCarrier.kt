package com.evomotiv.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "load_carrier")
class LoadCarrier(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    var name: String,

    var description: String? = null,

    @Column(name = "qr_code", nullable = false, unique = true)
    var qrCode: String,

    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(name = "deleted_at")
    var deletedAt: Instant? = null,

    @OneToMany(
        mappedBy = "loadCarrier",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    var items: MutableList<Item> = mutableListOf()
) {

    fun touch() {
        updatedAt = Instant.now()
    }

    fun isDeleted(): Boolean = deletedAt != null
}
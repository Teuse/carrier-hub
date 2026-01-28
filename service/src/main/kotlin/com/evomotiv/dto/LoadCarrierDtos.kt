package com.evomotiv.dto

import java.time.Instant

data class LoadCarrierDto(
    val id: Long,
    val name: String,
    val description: String?,
    val qrCode: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val deletedAt: Instant?,
)

data class CreateLoadCarrierDto(
    val name: String,
    val description: String? = null,
)

data class UpdateLoadCarrierDto(
    val name: String,
    val description: String? = null,
)
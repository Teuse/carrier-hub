package com.evomotiv.dto

import java.time.Instant

data class ItemDto(
    val id: Long,
    val name: String,
    val description: String?,
    val count: Int
)

data class LoadCarrierDto(
    val id: Long,
    val name: String,
    val description: String?,
    val qrCode: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val deletedAt: Instant?,
    val items: List<ItemDto>
)

data class CreateItemDto(
    val name: String,
    val description: String? = null,
    val count: Int
)

data class CreateLoadCarrierDto(
    val name: String,
    val description: String? = null,
    val items: List<CreateItemDto> = emptyList()
)

data class UpdateLoadCarrierDto(
    val name: String,
    val description: String? = null,
    val items: List<CreateItemDto> = emptyList()
)
package com.evomotiv.mapper

import com.evomotiv.dto.ItemDto
import com.evomotiv.dto.LoadCarrierDto
import com.evomotiv.model.LoadCarrier
import com.evomotiv.model.Item

object LoadCarrierMapper {

    fun toDto(entity: LoadCarrier): LoadCarrierDto =
        LoadCarrierDto(
            id = entity.id,
            name = entity.name,
            description = entity.description,
            qrCode = entity.qrCode,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt,
            deletedAt = entity.deletedAt,
            items = entity.items
                .sortedBy { it.id }
                .map { it.toDto() }
        )

    private fun Item.toDto(): ItemDto =
        ItemDto(
            id = this.id,
            name = this.name,
            description = this.description,
            count = this.count
        )
}
package com.evomotiv.mapper

import com.evomotiv.dto.LoadCarrierDto
import com.evomotiv.model.LoadCarrier

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
        )
}

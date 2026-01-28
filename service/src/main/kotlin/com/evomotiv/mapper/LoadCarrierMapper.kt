package com.evomotiv.mapper

import com.evomotiv.dto.LoadCarrierDto
import com.evomotiv.model.LoadCarrier

fun LoadCarrier.toDto() = LoadCarrierDto(
    id = id,
    name = name,
    description = description,
    qrCode = qrCode,
    createdAt = createdAt,
    updatedAt = updatedAt,
    deletedAt = deletedAt,
)

package com.evomotiv.mapper

import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.model.LoadCarrierRequest

fun LoadCarrierRequest.toDto() = LoadCarrierRequestDto(
    id = id,
    workspaceId = workspace.id,
    loadCarrierId = loadCarrier.id,
    loadCarrierName = loadCarrier.name,
    comment = comment,
    priority = priority,
    status = status,
    createdAt = createdAt,
    deliveredAt = deliveredAt
)

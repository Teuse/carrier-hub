package com.evomotiv.mapper

import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.model.LoadCarrierRequest

object LoadCarrierRequestMapper {
    fun toDto(e: LoadCarrierRequest) = LoadCarrierRequestDto(
        id = e.id,
        workbenchId = e.workbench.id,
        loadCarrierId = e.loadCarrier.id,
        loadCarrierName = e.loadCarrier.name,
        comment = e.comment,
        priority = e.priority,
        status = e.status,
        createdAt = e.createdAt,
        deliveredAt = e.deliveredAt
    )
}
package com.evomotiv.dto

import com.evomotiv.model.LoadCarrierRequestStatus
import com.evomotiv.model.RequestPriority
import java.time.Instant

data class LoadCarrierRequestDto(
    val id: Long,
    val workbenchId: Long,
    val loadCarrierId: Long,
    val loadCarrierName: String,
    val comment: String?,
    val priority: RequestPriority,
    val status: LoadCarrierRequestStatus,
    val createdAt: Instant,
    val deliveredAt: Instant?
)
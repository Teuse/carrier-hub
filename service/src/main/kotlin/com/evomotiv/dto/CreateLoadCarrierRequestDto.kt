package com.evomotiv.dto

import com.evomotiv.model.RequestPriority

data class CreateLoadCarrierRequestDto(
    val loadCarrierId: Long,
    val comment: String? = null,
    val priority: RequestPriority
)
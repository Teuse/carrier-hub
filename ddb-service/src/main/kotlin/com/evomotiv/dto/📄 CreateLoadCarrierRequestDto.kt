package com.evomotiv.dto

import com.evomotiv.model.RequestPriority
import jakarta.validation.constraints.NotBlank

data class CreateLoadCarrierRequestDto(

    @field:NotBlank
    val name: String,

    val description: String? = null,

    val comment: String? = null,

    val priority: RequestPriority = RequestPriority.NORMAL
)
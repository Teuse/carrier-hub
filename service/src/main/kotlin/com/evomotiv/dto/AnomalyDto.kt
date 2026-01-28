package com.evomotiv.dto

import com.evomotiv.model.AnomalyStatus
import java.time.Instant

data class AnomalyDto(
    val id: Long,
    val van: String?,
    val pn: String?,
    val kz: String?,
    val notes: String?,
    val workbench: WorkbenchDto,
    val status: AnomalyStatus,
    val createdAt: Instant,
    val updatedAt: Instant?
)

data class CreateAnomalyDto(
    val van: String?,
    val pn: String?,
    val kz: String?,
    val notes: String?,
)

data class UpdateAnomalyDto(
    val notes: String?,
    val status: AnomalyStatus?
)

package com.evomotiv.dto

import com.evomotiv.model.AnomalyStatus
import java.time.Instant

data class AnomalyDto(
    val id: Long,
    val van: String?,
    val pn: String?,
    val kz: String?,
    val notes: String?,
    val workspace: WorkspaceDto,
    val status: AnomalyStatus,
    val createdAt: Instant,
    val updatedAt: Instant?,
    val createdBy: String?,
    val reviewedBy: String?,
)

data class CreateAnomalyDto(
    val van: String?,
    val pn: String?,
    val kz: String?,
    val notes: String?,
)

data class UpdateAnomalyDto(
    val van: String?,
    val pn: String?,
    val kz: String?,
    val notes: String?,
    val status: AnomalyStatus?,
)

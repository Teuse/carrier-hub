package com.evomotiv.mapper

import com.evomotiv.dto.AnomalyDto
import com.evomotiv.model.Anomaly
import kotlin.String

fun Anomaly.toDto() = AnomalyDto(
    id = id,
    van = van,
    pn = pn,
    kz = kz,
    notes = notes,
    workbench = workbench.toDto(),
    status = status,
    createdAt = createdAt,
    updatedAt = updatedAt,
    createdBy = createdBy,
    reviewedBy = reviewedBy
)

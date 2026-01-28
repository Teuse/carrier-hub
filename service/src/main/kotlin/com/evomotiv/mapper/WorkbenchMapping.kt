package com.evomotiv.mapper

import com.evomotiv.dto.WorkbenchDto
import com.evomotiv.model.Workbench

fun Workbench.toDto() = WorkbenchDto(
    id = id,
    name = name,
    description = description,
    active = active
)
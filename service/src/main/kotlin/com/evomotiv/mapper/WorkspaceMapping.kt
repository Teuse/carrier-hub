package com.evomotiv.mapper

import com.evomotiv.dto.WorkspaceDto
import com.evomotiv.model.Workspace

fun Workspace.toDto() = WorkspaceDto(
    id = id,
    name = name,
    description = description,
    active = active
)
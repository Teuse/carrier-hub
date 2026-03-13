package com.evomotiv.dto

data class WorkspaceDto(
    val id: Long,
    val name: String,
    val description: String?,
)

data class CreateWorkspaceDto(
    val name: String,
    val description: String? = null
)
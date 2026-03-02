package com.evomotiv.dto

data class WorkspaceDto(
    val id: Long,
    val name: String,
    val description: String?,
    val active: Boolean
)

data class CreateWorkspaceDto(
    val name: String,
    val description: String? = null
)
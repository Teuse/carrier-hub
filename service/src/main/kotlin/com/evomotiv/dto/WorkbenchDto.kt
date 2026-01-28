package com.evomotiv.dto

data class WorkbenchDto(
    val id: Long,
    val name: String,
    val description: String?,
    val active: Boolean
)

data class CreateWorkbenchDto(
    val name: String,
    val description: String? = null
)
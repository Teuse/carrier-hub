package com.evomotiv.dto

data class DashboardOverviewDto(
    val totalRequests: Long,
    val openRequests: Long,
    val inWarehouse: Long,
    val inLogistics: Long,
    val deliveredToday: Long,

    val avgLeadTimeMinutes: Long,

    val requestsByStatus: Map<String, Long>,
    val requestsByWorkspace: List<WorkspaceCountDto>
)

data class WorkspaceCountDto(
    val workspaceName: String,
    val openRequests: Long
)
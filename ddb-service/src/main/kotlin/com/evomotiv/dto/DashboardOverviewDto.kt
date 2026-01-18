package com.evomotiv.dto

data class DashboardOverviewDto(
    val totalRequests: Long,
    val openRequests: Long,
    val inWarehouse: Long,
    val inLogistics: Long,
    val deliveredToday: Long,

    val avgLeadTimeMinutes: Long,

    val requestsByStatus: Map<String, Long>,
    val requestsByWorkbench: List<WorkbenchCountDto>
)

data class WorkbenchCountDto(
    val workbenchName: String,
    val openRequests: Long
)
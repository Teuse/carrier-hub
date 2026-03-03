package com.evomotiv.dto

import com.evomotiv.model.AnomalyStatus

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

data class ChartDataDto(
    val anomaliesByStatusInWeek: Map<AnomalyStatus, Long>,
    val anomaliesPerWorkspace: List<WorkspaceAnomalyPercentageDto>,
)

data class WorkspaceAnomalyPercentageDto(
    val name: String,
    val anomalyPercentage: Long
)
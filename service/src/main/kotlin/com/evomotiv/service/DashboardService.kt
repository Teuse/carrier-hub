package com.evomotiv.service

import com.evomotiv.dto.ChartDataDto
import com.evomotiv.dto.DashboardOverviewDto
import com.evomotiv.dto.WorkspaceAnomalyPercentageDto
import com.evomotiv.dto.WorkspaceCountDto
import com.evomotiv.model.AnomalyStatus
import com.evomotiv.repository.LoadCarrierRequestRepository
import com.evomotiv.model.LoadCarrierRequestStatus
import com.evomotiv.repository.AnomalyRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant

@Service
class DashboardService(
    private val requestRepo: LoadCarrierRequestRepository
) {
    @Autowired
    lateinit var anomalyRepo: AnomalyRepository

    fun getOverview(): DashboardOverviewDto {
        val all = requestRepo.findAll()

        val today = Instant.now()
            .truncatedTo(java.time.temporal.ChronoUnit.DAYS)

        val deliveredToday = all.count {
            it.status == LoadCarrierRequestStatus.DELIVERED &&
                    it.deliveredAt?.isAfter(today) == true
        }

        val avgLeadTime = all
            .filter {
                it.status == LoadCarrierRequestStatus.DELIVERED &&
                        it.deliveredAt != null
            }
            .map {
                Duration.between(it.createdAt, it.deliveredAt).toMinutes()
            }
            .average()
            .toLong()

        val byStatus =
            all.groupingBy { it.status.name }.eachCount()

        val byWorkspace = all
            .filter { it.status != LoadCarrierRequestStatus.DELIVERED }
            .groupBy { it.workspace.name }
            .map { (name, list) ->
                WorkspaceCountDto(
                    workspaceName = name,
                    openRequests = list.size.toLong()
                )
            }
            .sortedByDescending { it.openRequests }

        return DashboardOverviewDto(
            totalRequests = all.size.toLong(),
            openRequests = all.count {
                it.status != LoadCarrierRequestStatus.DELIVERED
            }.toLong(),
            inWarehouse = all.count {
                it.status == LoadCarrierRequestStatus.REQUESTED ||
                        it.status == LoadCarrierRequestStatus.WAREHOUSE_IN_PROGRESS
            }.toLong(),
            inLogistics = all.count {
                it.status == LoadCarrierRequestStatus.READY_FOR_PICKUP ||
                        it.status == LoadCarrierRequestStatus.IN_DELIVERY
            }.toLong(),
            deliveredToday = deliveredToday.toLong(),
            avgLeadTimeMinutes = avgLeadTime,
            requestsByStatus = byStatus.mapValues { it.value.toLong() },
            requestsByWorkspace = byWorkspace
        )
    }

    fun getChartData(): ChartDataDto {
        val anomaliesByStatusInWeek: Map<AnomalyStatus, Long> =
            AnomalyStatus.entries.toTypedArray().associateWith { status ->
                anomalyRepo.countAnomaliesByStatusInWeek(status)
            }
        val anomaliesPerWorkspace: List<WorkspaceAnomalyPercentageDto> =
            anomalyRepo.countRelativeAnomaliesPerWorkspace()

        return ChartDataDto(
            anomaliesByStatusInWeek = anomaliesByStatusInWeek,
            anomaliesPerWorkspace = anomaliesPerWorkspace
        )
    }
}
package com.evomotiv.repository

import com.evomotiv.dto.WorkspaceAnomalyPercentageDto
import org.springframework.data.jpa.repository.JpaRepository
import com.evomotiv.model.Anomaly
import com.evomotiv.model.AnomalyStatus
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AnomalyRepository : JpaRepository<Anomaly, Long> {

    fun findByWorkspaceId(workspaceId: Long): List<Anomaly>

    @Query(
        """
    SELECT a
    FROM Anomaly a
    JOIN FETCH a.workspace
    """
    )
    fun findAllWithWorkspace(): List<Anomaly>

    @Query(
        value = """
            SELECT CAST(COUNT(a) AS BIGINT)
            FROM Anomaly a
            WHERE a.status=:#{#status?.name()}
            AND a.created_at >= NOW() - INTERVAL '7 days'
            """,
        nativeQuery = true
    )
    fun countAnomaliesByStatusInWeek(@Param("status") status: AnomalyStatus): Long

    @Query(
        value = """
            SELECT 
                w.name,
                COALESCE(
                    CAST(ROUND(
                        COUNT(a.id) * 100.0 
                        / NULLIF(SUM(COUNT(a.id)) OVER (), 0),
                        2
                    ) AS BIGINT),
                    0
                ) AS anomaly_percentage
            FROM workspace w
            LEFT JOIN anomaly a 
                ON a.workspace_id = w.id
            GROUP BY w.id, w.name
            ORDER BY w.name;
            """,
        nativeQuery = true
    )
    fun countRelativeAnomaliesPerWorkspace(): List<WorkspaceAnomalyPercentageDto>
}
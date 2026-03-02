package com.evomotiv.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.evomotiv.model.Anomaly
import org.springframework.data.jpa.repository.Query

interface AnomalyRepository : JpaRepository<Anomaly, Long> {

    fun findByWorkspaceId(workspaceId: Long): List<Anomaly>

    @Query("""
    select a
    from Anomaly a
    join fetch a.workspace
    """)
    fun findAllWithWorkspace(): List<Anomaly>
}

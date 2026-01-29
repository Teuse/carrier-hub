package com.evomotiv.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.evomotiv.model.Anomaly
import org.springframework.data.jpa.repository.Query

interface AnomalyRepository : JpaRepository<Anomaly, Long> {

    fun findByWorkbenchId(workbenchId: Long): List<Anomaly>

    @Query("""
    select a
    from Anomaly a
    join fetch a.workbench
    """)
    fun findAllWithWorkbench(): List<Anomaly>
}

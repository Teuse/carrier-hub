package com.evomotiv.repository

import com.evomotiv.model.LoadCarrierRequest
import org.springframework.data.jpa.repository.JpaRepository

interface LoadCarrierRequestRepository :
    JpaRepository<LoadCarrierRequest, Long> {

    fun findByWorkbenchId(workbenchId: Long): List<LoadCarrierRequest>
}

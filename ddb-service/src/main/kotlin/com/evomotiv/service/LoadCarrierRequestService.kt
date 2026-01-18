package com.evomotiv.service

import com.evomotiv.dto.CreateLoadCarrierRequestDto
import org.springframework.stereotype.Service
import com.evomotiv.repository.LoadCarrierRequestRepository
import com.evomotiv.repository.WorkbenchRepository
import com.evomotiv.model.LoadCarrierRequest
import com.evomotiv.model.LoadCarrierRequestStatus
import java.time.Instant

@Service
class LoadCarrierRequestService(
    private val requestRepository: LoadCarrierRequestRepository,
    private val workbenchRepository: WorkbenchRepository
) {

    fun getAll(): List<LoadCarrierRequest> =
        requestRepository.findAll()

    fun getByWorkbench(workbenchId: Long): List<LoadCarrierRequest> =
        requestRepository.findByWorkbenchId(workbenchId)

    fun createRequest(
        workbenchId: Long,
        dto: CreateLoadCarrierRequestDto
    ): LoadCarrierRequest {

        val workbench = workbenchRepository.findById(workbenchId)
            .orElseThrow { IllegalArgumentException("Workbench not found") }

        return requestRepository.save(
            LoadCarrierRequest(
                workbench = workbench,
                name = dto.name,
                description = dto.description,
                comment = dto.comment,
                priority = dto.priority
            )
        )
    }

    fun advanceStatus(id: Long): LoadCarrierRequest {
        val request = requestRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Request not found") }

        request.status = when (request.status) {
            LoadCarrierRequestStatus.REQUESTED ->
                LoadCarrierRequestStatus.WAREHOUSE_IN_PROGRESS

            LoadCarrierRequestStatus.WAREHOUSE_IN_PROGRESS ->
                LoadCarrierRequestStatus.READY_FOR_PICKUP

            LoadCarrierRequestStatus.READY_FOR_PICKUP ->
                LoadCarrierRequestStatus.IN_DELIVERY

            LoadCarrierRequestStatus.IN_DELIVERY ->
                LoadCarrierRequestStatus.DELIVERED

            LoadCarrierRequestStatus.DELIVERED ->
                LoadCarrierRequestStatus.DELIVERED
        }

        request.deliveredAt = Instant.now()
        return requestRepository.save(request)
    }
}
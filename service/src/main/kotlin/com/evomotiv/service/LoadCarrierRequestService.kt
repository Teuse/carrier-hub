package com.evomotiv.service

import com.evomotiv.dto.CreateLoadCarrierRequestDto
import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.mapper.toDto
import org.springframework.stereotype.Service
import com.evomotiv.repository.LoadCarrierRequestRepository
import com.evomotiv.repository.WorkbenchRepository
import com.evomotiv.repository.LoadCarrierRepository
import com.evomotiv.model.LoadCarrierRequest
import com.evomotiv.model.LoadCarrierRequestStatus
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.time.Instant

@Service
class LoadCarrierRequestService(
    private val requestRepository: LoadCarrierRequestRepository,
    private val workbenchRepository: WorkbenchRepository,
    private val loadCarrierRepository: LoadCarrierRepository
) {

    fun getAll(): List<LoadCarrierRequestDto> =
        requestRepository.findAll().map{ it.toDto() }

    fun getByWorkbench(workbenchId: Long): List<LoadCarrierRequestDto> =
        requestRepository.findByWorkbenchId(workbenchId).map { it.toDto() }

    fun createRequest(workbenchId: Long, dto: CreateLoadCarrierRequestDto): LoadCarrierRequestDto {
        val workbench = workbenchRepository.findById(workbenchId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Workbench not found") }

        val template = loadCarrierRepository.findById(dto.loadCarrierId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }

        // falls du die Regel "nur 1 aktiver Request" hast:
        // if (requestRepo.existsActiveByWorkbenchId(workbenchId)) { ... }

        val entity = LoadCarrierRequest(
            workbench = workbench,
            loadCarrier = template,
            comment = dto.comment,
            priority = dto.priority
        )

        return requestRepository.save(entity).toDto()
    }

    fun advanceStatus(id: Long): LoadCarrierRequestDto {
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
        return requestRepository.save(request).toDto()
    }
}
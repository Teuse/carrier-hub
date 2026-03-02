package com.evomotiv.service

import com.evomotiv.dto.CreateLoadCarrierRequestDto
import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.mapper.toDto
import org.springframework.stereotype.Service
import com.evomotiv.repository.LoadCarrierRequestRepository
import com.evomotiv.repository.WorkspaceRepository
import com.evomotiv.repository.LoadCarrierRepository
import com.evomotiv.model.LoadCarrierRequest
import com.evomotiv.model.LoadCarrierRequestStatus
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.time.Instant

@Service
class LoadCarrierRequestService(
    private val requestRepository: LoadCarrierRequestRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val loadCarrierRepository: LoadCarrierRepository
) {

    fun getAll(): List<LoadCarrierRequestDto> =
        requestRepository.findAll().map{ it.toDto() }

    fun getByWorkspace(workspaceId: Long): List<LoadCarrierRequestDto> =
        requestRepository.findByWorkspaceId(workspaceId).map { it.toDto() }

    fun createRequest(workspaceId: Long, dto: CreateLoadCarrierRequestDto): LoadCarrierRequestDto {
        val workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found") }

        val template = loadCarrierRepository.findById(dto.loadCarrierId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }

        // falls du die Regel "nur 1 aktiver Request" hast:
        // if (requestRepo.existsActiveByWorkspaceId(workspaceId)) { ... }

        val entity = LoadCarrierRequest(
            workspace = workspace,
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
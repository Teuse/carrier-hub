package com.evomotiv.service

import com.evomotiv.dto.AnomalyDto
import com.evomotiv.dto.CreateAnomalyDto
import com.evomotiv.dto.UpdateAnomalyDto
import com.evomotiv.mapper.toDto
import com.evomotiv.model.Anomaly
import com.evomotiv.model.AnomalyStatus
import com.evomotiv.repository.AnomalyRepository
import com.evomotiv.repository.WorkspaceRepository
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.Instant

@Service
class AnomalyService(
    private val anomalyRepo: AnomalyRepository,
    private val workspaceRepo: WorkspaceRepository
) {

    @Transactional(readOnly = true)
    fun getAll(): List<AnomalyDto> =
        anomalyRepo.findAllWithWorkspace()
            .map { it.toDto() }
    
    fun getAllByWorkspaceNotClosed(id: Long): List<AnomalyDto> =
        anomalyRepo.findByWorkspaceIdAndStatusNot(id, AnomalyStatus.CLOSED)
            .map { it.toDto() }

    fun getAllByWorkspaceClosed(id: Long): List<AnomalyDto> =
        anomalyRepo.findByWorkspaceIdAndStatusOrderByUpdatedAtDesc(id, AnomalyStatus.CLOSED)
            .map { it.toDto() }

    fun createAnomaly(workspaceId: Long, dto: CreateAnomalyDto): AnomalyDto {
        val workspace = workspaceRepo.findById(workspaceId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found") }

        val email = (SecurityContextHolder.getContext().authentication as JwtAuthenticationToken)
            .token.getClaimAsString("email")

        val anomaly = Anomaly(
            van = dto.van,
            kz = dto.kz,
            pn = dto.pn,
            notes = dto.notes,
            workspace = workspace,
            status = AnomalyStatus.REPORTED,
            createdAt = Instant.now(),
            createdBy = email
        )
        return anomalyRepo.save(anomaly).toDto()
    }

    fun updateAnomaly(anomalyId: Long, dto: UpdateAnomalyDto): AnomalyDto {
        val anomaly = anomalyRepo.findById(anomalyId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Anomaly not found") }

        val email = (SecurityContextHolder.getContext().authentication as JwtAuthenticationToken)
            .token.getClaimAsString("email")

        anomaly.apply {
            updatedAt = Instant.now()
            dto.van?.let { van = it }
            dto.pn?.let { pn = it }
            dto.kz?.let { kz = it }
            dto.status?.let {
                anomaly.status = it
                anomaly.reviewedBy = if (it == AnomalyStatus.REPORTED) null else email
            }
            dto.notes?.let { notes = it }
        }

        return anomalyRepo.save(anomaly).toDto()
    }

    fun delete(id: Long) {
        if (anomalyRepo.existsById(id)) {
            anomalyRepo.deleteById(id)
        } else {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Anomaly not found")
        }
    }
}
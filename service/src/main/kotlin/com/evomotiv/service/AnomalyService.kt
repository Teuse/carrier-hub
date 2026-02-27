package com.evomotiv.service

import com.evomotiv.dto.AnomalyDto
import com.evomotiv.dto.CreateAnomalyDto
import com.evomotiv.dto.UpdateAnomalyDto
import com.evomotiv.mapper.toDto
import com.evomotiv.model.Anomaly
import com.evomotiv.model.AnomalyStatus
import com.evomotiv.repository.AnomalyRepository
import com.evomotiv.repository.WorkbenchRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.Optional

@Service
class AnomalyService(
    private val anomalyRepo: AnomalyRepository,
    private val workbenchRepo: WorkbenchRepository
) {

    @Transactional(readOnly = true)
    fun getAll(): List<AnomalyDto> =
        anomalyRepo.findAllWithWorkbench()
            .map { it.toDto() }

    fun getAllByWorkbench(workbenchId: Long): List<AnomalyDto> =
        anomalyRepo.findByWorkbenchId(workbenchId)
            .map { it.toDto() }

    fun createAnomaly(workbenchId: Long, dto: CreateAnomalyDto): AnomalyDto {
        val workbench = workbenchRepo.findById(workbenchId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Workbench not found") }

        val anomaly = Anomaly(
            van = dto.van,
            kz = dto.kz,
            pn = dto.pn,
            notes = dto.notes,
            workbench = workbench,
            status = AnomalyStatus.REPORTED,
            createdAt = Instant.now()
        )
        return anomalyRepo.save(anomaly).toDto()
    }

    fun updateAnomaly(anomalyId: Long, dto: UpdateAnomalyDto): AnomalyDto {
        val anomaly = anomalyRepo.findById(anomalyId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Anomaly not found") }

        anomaly.apply {
            updatedAt = Instant.now()
            dto.van?.let { van = it }
            dto.pn?.let { pn = it }
            dto.kz?.let { kz = it }
            dto.status?.let { status = it }
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
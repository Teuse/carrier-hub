package com.evomotiv.service

import com.evomotiv.dto.CreateLoadCarrierDto
import com.evomotiv.dto.LoadCarrierDto
import com.evomotiv.dto.UpdateLoadCarrierDto
import com.evomotiv.mapper.toDto
import com.evomotiv.model.LoadCarrier
import com.evomotiv.repository.LoadCarrierRepository
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import com.evomotiv.util.QrCodeGenerator

@Service
class LoadCarrierService(
    private val repo: LoadCarrierRepository
) {
    @Transactional
    fun getAllActive(): List<LoadCarrierDto> {
        return repo.findAllActive().map {
            it.toDto()
        }
    }

    @Transactional
    fun getById(id: Long): LoadCarrierDto {
        val lc = repo.findActiveById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }
        return lc.toDto()
    }


    @Transactional
    fun getByQrCode(qrCode: String): LoadCarrierDto {
        val lc = repo.findActiveByQrCode(qrCode)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }
        return lc.toDto()
    }
    @Transactional
    fun create(dto: CreateLoadCarrierDto) : LoadCarrierDto {
        val entity = com.evomotiv.model.LoadCarrier(
            name = dto.name,
            description = dto.description,
            qrCode = QrCodeGenerator.generate()
        )

        entity.touch()
        return repo.save(entity).toDto()
    }

    @Transactional
    fun update(id: Long, dto: UpdateLoadCarrierDto) : LoadCarrierDto {
        val entity = findActiveEntity(id)

        entity.name = dto.name
        entity.description = dto.description

        entity.touch()
        return repo.save(entity).toDto()
    }

    @Transactional
    fun softDelete(id: Long) {
        val entity = findActiveEntity(id)
        entity.deletedAt = Instant.now()
        entity.touch()
        repo.save(entity)
    }

    /* -------------------- helpers -------------------- */

    private fun findActiveEntity(id: Long): LoadCarrier {
        val entity = repo.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }

        if (entity.deletedAt != null) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found")
        }

        return entity
    }
}
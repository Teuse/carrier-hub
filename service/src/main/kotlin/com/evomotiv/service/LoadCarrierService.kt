package com.evomotiv.service

import com.evomotiv.dto.CreateLoadCarrierDto
import com.evomotiv.dto.UpdateLoadCarrierDto
import com.evomotiv.mapper.LoadCarrierMapper
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
    fun getAllActive() =
        repo.findAllActive().map(LoadCarrierMapper::toDto)

    @Transactional
    fun getById(id: Long) =
        LoadCarrierMapper.toDto(
            repo.findActiveById(id)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }
        )

    @Transactional
    fun getByQrCode(qrCode: String) =
        LoadCarrierMapper.toDto(
            repo.findActiveByQrCode(qrCode)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }
        )

    @Transactional
    fun create(dto: CreateLoadCarrierDto) : com.evomotiv.dto.LoadCarrierDto {
        val entity = com.evomotiv.model.LoadCarrier(
            name = dto.name,
            description = dto.description,
            qrCode = QrCodeGenerator.generate()
        )

        entity.touch()
        return LoadCarrierMapper.toDto(repo.save(entity))
    }

    @Transactional
    fun update(id: Long, dto: UpdateLoadCarrierDto) : com.evomotiv.dto.LoadCarrierDto {
        val entity = findActiveEntity(id)

        entity.name = dto.name
        entity.description = dto.description

        entity.touch()
        return LoadCarrierMapper.toDto(repo.save(entity))
    }

    @Transactional
    fun softDelete(id: Long) {
        val entity = findActiveEntity(id)
        entity.deletedAt = Instant.now()
        entity.touch()
        repo.save(entity)
    }

    /* -------------------- helpers -------------------- */

    private fun findActiveEntity(id: Long): com.evomotiv.model.LoadCarrier {
        val entity = repo.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found") }

        if (entity.deletedAt != null) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Load carrier not found")
        }

        return entity
    }
}
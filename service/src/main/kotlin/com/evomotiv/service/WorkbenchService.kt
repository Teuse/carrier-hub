package com.evomotiv.service

import com.evomotiv.dto.WorkbenchDto
import com.evomotiv.mapper.toDto
import org.springframework.stereotype.Service
import com.evomotiv.model.Workbench
import com.evomotiv.repository.WorkbenchRepository

@Service
class WorkbenchService(
    private val repository: WorkbenchRepository
) {
    fun getAllActive(): List<WorkbenchDto> =
        repository.findByActiveTrueOrderByNameAsc().map {
            it.toDto()
        }

    fun getAll(): List<WorkbenchDto> =
        repository.findAll().map {
            it.toDto()
        }

    fun create(name: String, description: String?): WorkbenchDto {
        require(!repository.existsByName(name)) {
            "Workbench with name '$name' already exists"
        }
        val wb = Workbench(
            name = name,
            description = description
        )
        return repository.save(wb).toDto()
    }

    fun deactivate(id: Long): WorkbenchDto {
        val wb = repository.findById(id)
            .orElseThrow { IllegalArgumentException("Workbench not found") }

        return repository.save(wb.copy(active = false)).toDto()
    }
}
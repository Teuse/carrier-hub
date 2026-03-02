package com.evomotiv.service

import com.evomotiv.dto.WorkspaceDto
import com.evomotiv.mapper.toDto
import org.springframework.stereotype.Service
import com.evomotiv.model.Workspace
import com.evomotiv.repository.WorkspaceRepository

@Service
class WorkspaceService(
    private val repository: WorkspaceRepository
) {
    fun getAllActive(): List<WorkspaceDto> =
        repository.findByActiveTrueOrderByNameAsc().map {
            it.toDto()
        }

    fun getAll(): List<WorkspaceDto> =
        repository.findAll().map {
            it.toDto()
        }

    fun create(name: String, description: String?): WorkspaceDto {
        require(!repository.existsByName(name)) {
            "Workspace with name '$name' already exists"
        }
        val wb = Workspace(
            name = name,
            description = description
        )
        return repository.save(wb).toDto()
    }

    fun deactivate(id: Long): WorkspaceDto {
        val wb = repository.findById(id)
            .orElseThrow { IllegalArgumentException("Workspace not found") }

        return repository.save(wb.copy(active = false)).toDto()
    }
}
package com.evomotiv.service

import com.evomotiv.dto.CreateWorkspaceDto
import com.evomotiv.dto.WorkspaceDto
import com.evomotiv.mapper.toDto
import org.springframework.stereotype.Service
import com.evomotiv.model.Workspace
import com.evomotiv.repository.WorkspaceRepository
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

@Service
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository,
    private val anomalyService: AnomalyService
) {
    fun getAll(): List<WorkspaceDto> =
        workspaceRepository.findAll().map {
            it.toDto()
        }

    fun create(name: String, description: String?): WorkspaceDto {
        require(!workspaceRepository.existsByName(name)) {
            "Workspace with name '$name' already exists"
        }
        val wb = Workspace(
            name = name,
            description = description
        )
        return workspaceRepository.save(wb).toDto()
    }

    fun update(id: Long, dto: CreateWorkspaceDto): WorkspaceDto {
        val workspace = workspaceRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found") }

        workspace.apply {
            dto.name.let { name = it }
            dto.description?.let { description = it }
        }

        return workspaceRepository.save(workspace).toDto()
    }

    @Transactional
    fun delete(id: Long) {
        try {
            if (!workspaceRepository.existsById(id)) throw NoSuchElementException()

            anomalyService.getAllByWorkspace(id).forEach {
                anomalyService.delete(it.id)
            }

            workspaceRepository.deleteById(id)
        } catch (e: NoSuchElementException) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found")
        }
    }
}
package com.evomotiv.service

import org.springframework.stereotype.Service
import com.evomotiv.model.Workbench
import com.evomotiv.repository.WorkbenchRepository

@Service
class WorkbenchService(
    private val repository: WorkbenchRepository
) {
    fun getAllActive(): List<Workbench> =
        repository.findByActiveTrueOrderByNameAsc()

    fun getAll(): List<Workbench> =
        repository.findAll()

    fun create(name: String, description: String?): Workbench {
        require(!repository.existsByName(name)) {
            "Workbench with name '$name' already exists"
        }

        return repository.save(
            Workbench(
                name = name,
                description = description
            )
        )
    }

    fun deactivate(id: Long): Workbench {
        val wb = repository.findById(id)
            .orElseThrow { IllegalArgumentException("Workbench not found") }

        return repository.save(wb.copy(active = false))
    }
}
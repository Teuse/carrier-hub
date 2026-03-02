package com.evomotiv.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.evomotiv.model.Workspace

interface WorkspaceRepository : JpaRepository<Workspace, Long> {

    fun findByActiveTrueOrderByNameAsc(): List<Workspace>

    fun existsByName(name: String): Boolean
}
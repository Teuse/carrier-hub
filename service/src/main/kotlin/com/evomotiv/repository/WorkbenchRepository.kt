package com.evomotiv.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.evomotiv.model.Workbench

interface WorkbenchRepository : JpaRepository<Workbench, Long> {

    fun findByActiveTrueOrderByNameAsc(): List<Workbench>

    fun existsByName(name: String): Boolean
}
package com.evomotiv.config

import com.evomotiv.model.Workspace
import com.evomotiv.repository.WorkspaceRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Profile("dev")
@Configuration
class WorkspaceInitializer {

    private val log = LoggerFactory.getLogger(javaClass)

    @Bean
    fun initWorkspaces(
        workspaceRepository: WorkspaceRepository
    ) = ApplicationRunner {

        if (workspaceRepository.count() > 0) {
            return@ApplicationRunner
        }

        val defaults = listOf(
            Workspace(name = "Workspace 1", description = "Assembly Line 1"),
            Workspace(name = "Workspace 2", description = "Assembly Line 2"),
            Workspace(name = "Workspace 3", description = "Assembly Line 3"),
            Workspace(name = "Workspace 4", description = "Assembly Line 4"),
            Workspace(name = "Workspace 5", description = "Assembly Line 5")
        )

        workspaceRepository.saveAll(defaults)

        log.info("✅ Initialized {} example workspaces", defaults.size)
    }
}
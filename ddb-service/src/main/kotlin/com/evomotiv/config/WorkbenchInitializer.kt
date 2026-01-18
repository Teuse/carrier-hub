package com.evomotiv.config

import com.evomotiv.model.Workbench
import com.evomotiv.repository.WorkbenchRepository
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Profile("dev")
@Configuration
class WorkbenchInitializer {

    @Bean
    fun initWorkbenches(
        workbenchRepository: WorkbenchRepository
    ) = ApplicationRunner {

        if (workbenchRepository.count() > 0) {
            return@ApplicationRunner
        }

        val defaults = listOf(
            Workbench(name = "Workbench 1", description = "Assembly Line 1"),
            Workbench(name = "Workbench 2", description = "Assembly Line 2"),
            Workbench(name = "Workbench 3", description = "Assembly Line 3"),
            Workbench(name = "Workbench 4", description = "Assembly Line 4"),
            Workbench(name = "Workbench 5", description = "Assembly Line 5")
        )

        workbenchRepository.saveAll(defaults)

        println("✅ Initialized ${defaults.size} default workbenches")
    }
}
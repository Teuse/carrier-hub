package com.evomotiv.controller

import com.evomotiv.dto.AnomalyDto
import com.evomotiv.dto.UpdateAnomalyDto
import com.evomotiv.service.AnomalyService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/anomalies")
class AnomalyController(
    private val anomalyService: AnomalyService
) {
    @GetMapping
    fun getAll() = anomalyService.getAll()

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody dto: UpdateAnomalyDto
    ): AnomalyDto =
        anomalyService.updateAnomaly(id, dto)
}

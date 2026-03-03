package com.evomotiv.controller

import com.evomotiv.dto.*
import com.evomotiv.service.AnomalyService
import com.evomotiv.service.LoadCarrierRequestService
import com.evomotiv.service.WorkspaceService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Tag(name = "Workspace", description = "Workspace operations")
@RestController
@RequestMapping("/api/workspaces")
class WorkspaceController(
    private val loadCarrierRequestService: LoadCarrierRequestService,
    private val workspaceService: WorkspaceService,
    private val anomalyService: AnomalyService
) {
    @GetMapping
    fun getAll(): List<WorkspaceDto> =
        workspaceService.getAll()

    @PostMapping
    fun create(@RequestBody body: CreateWorkspaceDto): WorkspaceDto =
        workspaceService.create(body.name, body.description)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody dto: CreateWorkspaceDto
    ): WorkspaceDto =
        workspaceService.update(id, dto)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = workspaceService.delete(id)

    /* ===================== */
    /* REQUESTS              */
    /* ===================== */

    @GetMapping("/{id}/requests")
    fun getRequests(@PathVariable id: Long): List<LoadCarrierRequestDto> =
        loadCarrierRequestService.getByWorkspace(id)

    @PostMapping("/{id}/requests")
    fun createRequest(
        @PathVariable id: Long,
        @RequestBody dto: CreateLoadCarrierRequestDto
    ): LoadCarrierRequestDto =
        loadCarrierRequestService.createRequest(id, dto)

    /* ===================== */
    /* ANOMALIES             */
    /* ===================== */

    @GetMapping("/{id}/anomalies")
    fun getAnomalies(@PathVariable id: Long): List<AnomalyDto> =
        anomalyService.getAllByWorkspace(id)

    @PostMapping("/{id}/anomalies")
    fun createAnomaly(
        @PathVariable id: Long,
        @RequestBody dto: CreateAnomalyDto
    ): AnomalyDto = anomalyService.createAnomaly(id, dto)

}
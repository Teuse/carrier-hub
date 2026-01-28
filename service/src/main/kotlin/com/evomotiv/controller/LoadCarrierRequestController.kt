package com.evomotiv.controller

import com.evomotiv.dto.LoadCarrierRequestDto
import com.evomotiv.service.LoadCarrierRequestService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requests")
class LoadCarrierRequestController(
    private val service: LoadCarrierRequestService
) {

    @GetMapping
    fun getAll(): List<LoadCarrierRequestDto> =
        service.getAll()

    @PostMapping("/{id}/advance")
    fun advance(@PathVariable id: Long): LoadCarrierRequestDto =
        service.advanceStatus(id)
}
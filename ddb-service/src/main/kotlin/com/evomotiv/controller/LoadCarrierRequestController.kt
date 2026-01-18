package com.evomotiv.controller

import com.evomotiv.service.LoadCarrierRequestService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requests")
class LoadCarrierRequestController(
    private val service: LoadCarrierRequestService
) {

    @GetMapping
    fun getAll() =
        service.getAll()

    @PostMapping("/{id}/advance")
    fun advance(@PathVariable id: Long) =
        service.advanceStatus(id)
}
package com.edu.Mini_D_Mart.order.controller;

import com.edu.Mini_D_Mart.order.dto.PickupSlotRequest;
import com.edu.Mini_D_Mart.order.dto.PickupSlotResponse;
import com.edu.Mini_D_Mart.order.service.PickupSlotService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class PickupSlotController {

    private final PickupSlotService pickupSlotService;

    public PickupSlotController(PickupSlotService pickupSlotService) {
        this.pickupSlotService = pickupSlotService;
    }

    @GetMapping
    public ResponseEntity<List<PickupSlotResponse>> getAvailableSlots() {
        return ResponseEntity.ok(pickupSlotService.getAvailableSlots());
    }

    @GetMapping("/all")
    public ResponseEntity<List<PickupSlotResponse>> getAllSlots() {
        return ResponseEntity.ok(pickupSlotService.getAllSlots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PickupSlotResponse> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(pickupSlotService.getSlotById(id));
    }

    @PostMapping
    public ResponseEntity<PickupSlotResponse> createSlot(@Valid @RequestBody PickupSlotRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pickupSlotService.createSlot(request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<PickupSlotResponse> toggleSlotStatus(@PathVariable Long id) {
        return ResponseEntity.ok(pickupSlotService.toggleSlotStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        pickupSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}

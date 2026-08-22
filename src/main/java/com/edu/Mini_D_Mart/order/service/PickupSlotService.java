package com.edu.Mini_D_Mart.order.service;

import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.order.dto.PickupSlotRequest;
import com.edu.Mini_D_Mart.order.dto.PickupSlotResponse;
import com.edu.Mini_D_Mart.order.entity.PickupSlot;
import com.edu.Mini_D_Mart.order.repository.PickupSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PickupSlotService {

    private final PickupSlotRepository pickupSlotRepository;

    public PickupSlotService(PickupSlotRepository pickupSlotRepository) {
        this.pickupSlotRepository = pickupSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<PickupSlotResponse> getAvailableSlots() {
        return pickupSlotRepository.findAllByActiveTrueAndSlotDateGreaterThanEqualOrderBySlotDateAscStartTimeAsc(LocalDate.now())
                .stream()
                .filter(PickupSlot::hasAvailableCapacity)
                .map(PickupSlotResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PickupSlotResponse> getAllSlots() {
        return pickupSlotRepository.findAllByOrderBySlotDateDescStartTimeAsc()
                .stream()
                .map(PickupSlotResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PickupSlotResponse getSlotById(Long id) {
        PickupSlot slot = pickupSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));
        return PickupSlotResponse.from(slot);
    }

    @Transactional
    public PickupSlotResponse createSlot(PickupSlotRequest request) {
        if (request.startTime() == null || request.endTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }
        if (request.startTime().isAfter(request.endTime())) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }

        if (pickupSlotRepository.findBySlotDateAndStartTime(request.slotDate(), request.startTime()).isPresent()) {
            throw new IllegalArgumentException("A pickup slot for this date and start time already exists");
        }

        PickupSlot slot = new PickupSlot(
                request.slotDate(),
                request.startTime(),
                request.endTime(),
                request.maxCapacity()
        );

        PickupSlot saved = pickupSlotRepository.save(slot);
        return PickupSlotResponse.from(saved);
    }

    @Transactional
    public PickupSlotResponse toggleSlotStatus(Long id) {
        PickupSlot slot = pickupSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));

        slot.setActive(!slot.isActive());
        PickupSlot saved = pickupSlotRepository.save(slot);
        return PickupSlotResponse.from(saved);
    }

    @Transactional
    public void deleteSlot(Long id) {
        PickupSlot slot = pickupSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));

        if (slot.getBookedCount() > 0) {
            throw new IllegalStateException("Cannot delete a slot with active bookings. Deactivate it instead.");
        }

        pickupSlotRepository.delete(slot);
    }
}

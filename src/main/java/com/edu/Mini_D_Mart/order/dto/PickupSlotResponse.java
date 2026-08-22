package com.edu.Mini_D_Mart.order.dto;

import com.edu.Mini_D_Mart.order.entity.PickupSlot;

import java.time.LocalDate;
import java.time.LocalTime;

public record PickupSlotResponse(
        Long id,
        LocalDate slotDate,
        LocalTime startTime,
        LocalTime endTime,
        String formattedSlot,
        Integer maxCapacity,
        Integer bookedCount,
        int remainingCapacity,
        boolean available,
        boolean active
) {

    public static PickupSlotResponse from(PickupSlot slot) {
        String formatted = String.format("%s (%02d:%02d - %02d:%02d)",
                slot.getSlotDate(),
                slot.getStartTime().getHour(), slot.getStartTime().getMinute(),
                slot.getEndTime().getHour(), slot.getEndTime().getMinute());

        return new PickupSlotResponse(
                slot.getId(),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                formatted,
                slot.getMaxCapacity(),
                slot.getBookedCount(),
                slot.getRemainingCapacity(),
                slot.hasAvailableCapacity(),
                slot.isActive()
        );
    }
}

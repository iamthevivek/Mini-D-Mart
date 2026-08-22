package com.edu.Mini_D_Mart.order.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record PickupSlotRequest(
        @NotNull(message = "Slot date is required")
        @FutureOrPresent(message = "Slot date cannot be in the past")
        LocalDate slotDate,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Max capacity is required")
        @Min(value = 1, message = "Max capacity must be at least 1")
        Integer maxCapacity
) {
}

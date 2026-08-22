package com.edu.Mini_D_Mart.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CancelOrderRequest(
        @NotBlank(message = "Cancellation reason is required")
        @Size(max = 500, message = "Reason must not exceed 500 characters")
        String cancellationReason
) {
}

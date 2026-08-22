package com.edu.Mini_D_Mart.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyPickupRequest(
        @NotBlank(message = "Pickup verification code is required")
        @Size(min = 4, max = 10, message = "Verification code must be between 4 and 10 digits")
        String verificationCode
) {
}

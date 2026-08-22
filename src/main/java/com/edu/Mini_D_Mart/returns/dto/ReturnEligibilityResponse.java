package com.edu.Mini_D_Mart.returns.dto;

public record ReturnEligibilityResponse(
        boolean isEligible,
        String reasonMessage,
        int daysRemaining,
        boolean isReturnableCategory,
        boolean isDelivered
) {
}

package com.edu.Mini_D_Mart.returns.dto;

import com.edu.Mini_D_Mart.returns.entity.ReturnReason;
import com.edu.Mini_D_Mart.returns.entity.ReturnType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateReturnRequestDto(
        @NotNull(message = "Order ID is required")
        Long orderId,

        @NotNull(message = "Order Item ID is required")
        Long orderItemId,

        @NotNull(message = "Request type is required (RETURN or EXCHANGE)")
        ReturnType type,

        @NotNull(message = "Reason is required")
        ReturnReason reason,

        @Size(max = 1000, message = "Details must not exceed 1000 characters")
        String details,

        @Size(max = 500, message = "Image evidence URL must not exceed 500 characters")
        String imageEvidenceUrl,

        Long exchangeProductId
) {
}

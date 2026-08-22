package com.edu.Mini_D_Mart.order.dto;

import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status,

        @Size(max = 500, message = "Staff notes must not exceed 500 characters")
        String staffNotes
) {
}

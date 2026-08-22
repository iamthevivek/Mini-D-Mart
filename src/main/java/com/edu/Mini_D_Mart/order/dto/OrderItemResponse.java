package com.edu.Mini_D_Mart.order.dto;

import com.edu.Mini_D_Mart.order.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productSku,
        String productImageUrl,
        String unit,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal subtotal,
        boolean isReturnedOrExchanged,
        boolean isReturnable,
        Integer returnWindowDays
) {

    public static OrderItemResponse from(OrderItem item) {
        boolean returnable = item.getProduct() != null && item.getProduct().isReturnable();
        Integer returnDays = item.getProduct() != null ? item.getProduct().getReturnWindowDays() : 7;

        return new OrderItemResponse(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProductName(),
                item.getProductSku(),
                item.getProductImageUrl(),
                item.getUnit(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.isReturnedOrExchanged(),
                returnable,
                returnDays
        );
    }
}

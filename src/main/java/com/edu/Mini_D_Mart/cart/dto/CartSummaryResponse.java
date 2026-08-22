package com.edu.Mini_D_Mart.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartSummaryResponse(
        List<CartItemResponse> items,
        int totalItems,
        BigDecimal subtotal,
        BigDecimal deliveryFee,
        BigDecimal freeDeliveryThreshold,
        boolean eligibleForFreeDelivery,
        BigDecimal amountNeededForFreeDelivery,
        BigDecimal estimatedTax,
        BigDecimal totalAmount,
        boolean hasUnavailableItems
) {
}

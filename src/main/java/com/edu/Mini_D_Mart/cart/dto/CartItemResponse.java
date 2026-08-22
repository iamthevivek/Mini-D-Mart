package com.edu.Mini_D_Mart.cart.dto;

import com.edu.Mini_D_Mart.cart.entity.CartItem;
import com.edu.Mini_D_Mart.product.dto.ProductResponse;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        BigDecimal itemPrice,
        BigDecimal subtotal,
        boolean isAvailable,
        String availabilityMessage
) {

    public static CartItemResponse from(CartItem item) {
        ProductResponse prod = ProductResponse.from(item.getProduct());
        BigDecimal price = item.getProduct().getSellingPrice();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

        boolean available = item.getProduct().isActive() && item.getProduct().getStockQuantity() >= item.getQuantity();
        String message = "";
        if (!item.getProduct().isActive()) {
            message = "Product is currently unavailable";
        } else if (item.getProduct().getStockQuantity() == 0) {
            message = "Product is out of stock";
        } else if (item.getProduct().getStockQuantity() < item.getQuantity()) {
            message = "Only " + item.getProduct().getStockQuantity() + " units available in stock";
        }

        return new CartItemResponse(
                item.getId(),
                prod,
                item.getQuantity(),
                price,
                subtotal,
                available,
                message
        );
    }
}

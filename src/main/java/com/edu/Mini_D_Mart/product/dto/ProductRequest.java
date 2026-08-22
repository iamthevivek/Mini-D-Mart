package com.edu.Mini_D_Mart.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(

        @NotBlank(message = "Product name is required")
        @Size(min = 2, max = 150, message = "Name must be between 2 and 150 characters")
        String name,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull(message = "Category ID is required")
        Long categoryId,

        @NotBlank(message = "SKU is required")
        @Size(max = 50, message = "SKU must not exceed 50 characters")
        String sku,

        @Size(max = 50, message = "Barcode must not exceed 50 characters")
        String barcode,

        @Size(max = 500, message = "Image URL must not exceed 500 characters")
        String imageUrl,

        @NotBlank(message = "Unit is required (e.g. 1 kg, 500 g, 1 L)")
        @Size(max = 50, message = "Unit must not exceed 50 characters")
        String unit,

        @NotNull(message = "MRP Price is required")
        @DecimalMin(value = "0.01", message = "MRP price must be greater than 0")
        BigDecimal mrpPrice,

        @NotNull(message = "Selling Price is required")
        @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
        BigDecimal sellingPrice,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,

        @Min(value = 0, message = "Low stock threshold cannot be negative")
        Integer lowStockThreshold,

        Boolean isReturnable,

        @Min(value = 0, message = "Return window days cannot be negative")
        Integer returnWindowDays
) {
}

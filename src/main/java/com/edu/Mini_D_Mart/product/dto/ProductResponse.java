package com.edu.Mini_D_Mart.product.dto;

import com.edu.Mini_D_Mart.category.dto.CategoryResponse;
import com.edu.Mini_D_Mart.product.entity.Product;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

public record ProductResponse(
        Long id,
        String name,
        String description,
        CategoryResponse category,
        String sku,
        String barcode,
        String imageUrl,
        String unit,
        BigDecimal mrpPrice,
        BigDecimal sellingPrice,
        Integer stockQuantity,
        Integer lowStockThreshold,
        boolean isLowStock,
        boolean inStock,
        boolean isReturnable,
        Integer returnWindowDays,
        int discountPercentage,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {

    public static ProductResponse from(Product product) {
        int discount = 0;
        if (product.getMrpPrice() != null && product.getSellingPrice() != null
                && product.getMrpPrice().compareTo(BigDecimal.ZERO) > 0
                && product.getMrpPrice().compareTo(product.getSellingPrice()) > 0) {
            BigDecimal diff = product.getMrpPrice().subtract(product.getSellingPrice());
            discount = diff.multiply(BigDecimal.valueOf(100))
                    .divide(product.getMrpPrice(), 0, RoundingMode.HALF_UP)
                    .intValue();
        }

        boolean isLow = product.getStockQuantity() <= product.getLowStockThreshold();
        boolean inStock = product.getStockQuantity() > 0;

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCategory() != null ? CategoryResponse.from(product.getCategory()) : null,
                product.getSku(),
                product.getBarcode(),
                product.getImageUrl(),
                product.getUnit(),
                product.getMrpPrice(),
                product.getSellingPrice(),
                product.getStockQuantity(),
                product.getLowStockThreshold(),
                isLow,
                inStock,
                product.isReturnable(),
                product.getReturnWindowDays(),
                discount,
                product.isActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}

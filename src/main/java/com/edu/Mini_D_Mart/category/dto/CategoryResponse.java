package com.edu.Mini_D_Mart.category.dto;

import com.edu.Mini_D_Mart.category.entity.Category;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        String imageUrl,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {

    public static CategoryResponse from(Category category) {

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageUrl(),
                category.isActive(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
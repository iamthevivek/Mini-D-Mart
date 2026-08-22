package com.edu.Mini_D_Mart.auth.dto;

import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.entity.User;

import java.time.Instant;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Role role,
        boolean active,
        Instant createdAt
) {

    public static UserResponse from(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
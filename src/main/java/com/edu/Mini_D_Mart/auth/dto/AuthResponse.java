package com.edu.Mini_D_Mart.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {
}
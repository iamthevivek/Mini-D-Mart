package com.edu.Mini_D_Mart.auth.controller;

import com.edu.Mini_D_Mart.auth.dto.AuthResponse;
import com.edu.Mini_D_Mart.auth.dto.LoginRequest;
import com.edu.Mini_D_Mart.auth.dto.RegisterRequest;
import com.edu.Mini_D_Mart.auth.dto.UserResponse;
import com.edu.Mini_D_Mart.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                authService.getCurrentUser(
                        authentication.getName()
                )
        );
    }
}
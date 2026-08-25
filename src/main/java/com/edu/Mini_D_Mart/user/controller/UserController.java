package com.edu.Mini_D_Mart.user.controller;

import com.edu.Mini_D_Mart.auth.dto.UserResponse;
import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.user.dto.UpdateProfileRequest;
import com.edu.Mini_D_Mart.user.dto.UpdateRoleRequest;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(UserResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        Long userId = getUserId(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.name().trim());
        if (request.phone() != null) {
            String trimmedPhone = request.phone().trim();
            user.setPhone(trimmedPhone.isEmpty() ? null : trimmedPhone);
        } else {
            user.setPhone(null);
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(saved));
    }

    @PatchMapping("/{id}/role")
    @Transactional
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setRole(request.role());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(saved));
    }

    @PatchMapping("/{id}/toggle")
    @Transactional
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(saved));
    }
}

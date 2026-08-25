package com.edu.Mini_D_Mart.auth.service;

import com.edu.Mini_D_Mart.auth.dto.AuthResponse;
import com.edu.Mini_D_Mart.auth.dto.LoginRequest;
import com.edu.Mini_D_Mart.auth.dto.RegisterRequest;
import com.edu.Mini_D_Mart.auth.dto.UserResponse;
import com.edu.Mini_D_Mart.security.JwtService;
import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        User user = new User();

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.password())
        );
        user.setPhone(
                request.phone() == null
                        ? null
                        : request.phone().trim()
        );

        user.setRole(Role.CUSTOMER);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                "Bearer",
                UserResponse.from(savedUser)
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {

        String email = normalizeEmail(request.email());

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.password()
                        )
                );

        User user = userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .or(() -> {
                    if (email.endsWith("@onemart.com")) {
                        return userRepository.findByEmailIgnoreCase(email.replace("@onemart.com", "@minidmart.com"));
                    } else if (email.endsWith("@minidmart.com")) {
                        return userRepository.findByEmailIgnoreCase(email.replace("@minidmart.com", "@onemart.com"));
                    }
                    return java.util.Optional.empty();
                })
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (user.getEmail().toLowerCase().endsWith("@minidmart.com")) {
            user.setEmail(user.getEmail().toLowerCase().replace("@minidmart.com", "@onemart.com"));
            user = userRepository.save(user);
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                UserResponse.from(user)
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String userId) {

        Long id;

        try {
            id = Long.parseLong(userId);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(
                    "Invalid authenticated user"
            );
        }

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User account not found"
                        )
                );

        return UserResponse.from(user);
    }

    private String normalizeEmail(String email) {

        return email.trim().toLowerCase();
    }
}
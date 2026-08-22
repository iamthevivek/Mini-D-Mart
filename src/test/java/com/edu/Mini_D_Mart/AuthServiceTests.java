package com.edu.Mini_D_Mart;

import com.edu.Mini_D_Mart.auth.dto.AuthResponse;
import com.edu.Mini_D_Mart.auth.dto.LoginRequest;
import com.edu.Mini_D_Mart.auth.dto.RegisterRequest;
import com.edu.Mini_D_Mart.auth.service.AuthService;
import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should successfully register a new customer")
    void testRegisterCustomer() {
        RegisterRequest request = new RegisterRequest(
                "Alice Smith",
                "alice.smith@example.com",
                "Alice@Pass123",
                "+91 9988776655"
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals("Alice Smith", response.user().name());
        assertEquals("alice.smith@example.com", response.user().email());
        assertEquals(Role.CUSTOMER, response.user().role());
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterDuplicateEmail() {
        RegisterRequest request1 = new RegisterRequest(
                "Bob Test",
                "bob.test@example.com",
                "Bob@Pass123",
                "+91 9988776600"
        );
        authService.register(request1);

        RegisterRequest request2 = new RegisterRequest(
                "Bob Duplicate",
                "bob.test@example.com",
                "Bob@Pass1234",
                "+91 9988776601"
        );

        assertThrows(IllegalArgumentException.class, () -> authService.register(request2));
    }

    @Test
    @DisplayName("Should login successfully with seeded customer credentials")
    void testLoginSuccess() {
        LoginRequest loginRequest = new LoginRequest("customer@minidmart.com", "Customer@1234");
        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertEquals("customer@minidmart.com", response.user().email());
    }

    @Test
    @DisplayName("Should fail login with wrong password")
    void testLoginWrongPassword() {
        LoginRequest loginRequest = new LoginRequest("customer@minidmart.com", "WrongPassword999");
        assertThrows(Exception.class, () -> authService.login(loginRequest));
    }
}

package com.edu.Mini_D_Mart;

import com.edu.Mini_D_Mart.auth.dto.UserResponse;
import com.edu.Mini_D_Mart.user.controller.UserController;
import com.edu.Mini_D_Mart.user.dto.UpdateProfileRequest;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
class UserControllerTests {

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Customer should be able to update their own profile")
    void testCustomerUpdateProfile() {
        User user = userRepository.findByEmailIgnoreCase("customer@onemart.com").orElseThrow();
        Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getId().toString(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );

        UpdateProfileRequest request = new UpdateProfileRequest(
                "Updated Customer Name",
                "+91 9876543210"
        );

        ResponseEntity<UserResponse> response = userController.updateProfile(auth, request);
        assertNotNull(response.getBody());
        assertEquals("Updated Customer Name", response.getBody().name());
        assertEquals("+91 9876543210", response.getBody().phone());

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("Updated Customer Name", updatedUser.getName());
        assertEquals("+91 9876543210", updatedUser.getPhone());
    }
}

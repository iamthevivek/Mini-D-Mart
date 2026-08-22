package com.edu.Mini_D_Mart.user.dto;

import com.edu.Mini_D_Mart.user.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequest(
        @NotNull(message = "Role is required (CUSTOMER, STAFF, MANAGER, ADMIN)")
        Role role
) {
}

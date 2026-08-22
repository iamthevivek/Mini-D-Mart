package com.edu.Mini_D_Mart.returns.dto;

import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewReturnRequestDto(
        @NotNull(message = "Status is required (APPROVED, REJECTED, COLLECTED, COMPLETED)")
        ReturnStatus status,

        @Size(max = 1000, message = "Staff review notes must not exceed 1000 characters")
        String staffReviewNotes,

        Boolean restockItem
) {
}

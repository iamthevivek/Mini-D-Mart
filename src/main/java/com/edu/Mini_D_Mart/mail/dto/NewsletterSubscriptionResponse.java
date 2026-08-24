package com.edu.Mini_D_Mart.mail.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterSubscriptionResponse {

    private boolean success;
    private String email;
    private String voucherCode;
    private Double discountAmount;
    private String message;
    private boolean emailDispatched;
}

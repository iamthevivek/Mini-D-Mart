package com.edu.Mini_D_Mart.mail.controller;

import com.edu.Mini_D_Mart.mail.dto.NewsletterSubscriptionRequest;
import com.edu.Mini_D_Mart.mail.dto.NewsletterSubscriptionResponse;
import com.edu.Mini_D_Mart.mail.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
@Tag(name = "Newsletter & Offers", description = "Endpoints for claiming promotional vouchers and newsletter dispatch")
public class NewsletterController {

    private final EmailService emailService;

    @PostMapping("/subscribe")
    @Operation(summary = "Subscribe to VIP Savings Club and receive real ₹50 OFF discount voucher")
    public ResponseEntity<NewsletterSubscriptionResponse> subscribe(
            @Valid @RequestBody NewsletterSubscriptionRequest request
    ) {
        String promoCode = "SAVE50";
        boolean emailSent = emailService.sendVoucherEmail(request.getEmail(), promoCode);

        String message = emailSent
                ? "Offer email with voucher code " + promoCode + " successfully sent to " + request.getEmail() + "!"
                : "Voucher code " + promoCode + " activated! Use this code at checkout for flat ₹50 discount.";

        NewsletterSubscriptionResponse response = NewsletterSubscriptionResponse.builder()
                .success(true)
                .email(request.getEmail())
                .voucherCode(promoCode)
                .discountAmount(50.00)
                .message(message)
                .emailDispatched(emailSent)
                .build();

        return ResponseEntity.ok(response);
    }
}

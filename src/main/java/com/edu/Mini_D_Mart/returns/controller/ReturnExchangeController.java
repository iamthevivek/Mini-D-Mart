package com.edu.Mini_D_Mart.returns.controller;

import com.edu.Mini_D_Mart.returns.dto.CreateReturnRequestDto;
import com.edu.Mini_D_Mart.returns.dto.ReturnEligibilityResponse;
import com.edu.Mini_D_Mart.returns.dto.ReturnRequestResponse;
import com.edu.Mini_D_Mart.returns.dto.ReviewReturnRequestDto;
import com.edu.Mini_D_Mart.returns.service.ReturnExchangeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
public class ReturnExchangeController {

    private final ReturnExchangeService returnExchangeService;

    public ReturnExchangeController(ReturnExchangeService returnExchangeService) {
        this.returnExchangeService = returnExchangeService;
    }

    private Long getUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    @GetMapping("/customer/eligibility")
    public ResponseEntity<ReturnEligibilityResponse> checkEligibility(
            Authentication authentication,
            @RequestParam Long orderId,
            @RequestParam Long orderItemId
    ) {
        return ResponseEntity.ok(returnExchangeService.checkEligibility(getUserId(authentication), orderId, orderItemId));
    }

    @PostMapping("/customer")
    public ResponseEntity<ReturnRequestResponse> createReturnRequest(
            Authentication authentication,
            @Valid @RequestBody CreateReturnRequestDto requestDto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(returnExchangeService.createReturnRequest(getUserId(authentication), requestDto));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<ReturnRequestResponse>> getCustomerRequests(Authentication authentication) {
        return ResponseEntity.ok(returnExchangeService.getCustomerRequests(getUserId(authentication)));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<ReturnRequestResponse> getCustomerRequestById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        ReturnRequestResponse response = returnExchangeService.getRequestById(id);
        if (!response.userId().equals(getUserId(authentication))) {
            throw new IllegalArgumentException("You are not authorized to view this return request");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/staff")
    public ResponseEntity<List<ReturnRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(returnExchangeService.getAllRequests());
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<ReturnRequestResponse> getStaffRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(returnExchangeService.getRequestById(id));
    }

    @PatchMapping("/staff/{id}/review")
    public ResponseEntity<ReturnRequestResponse> reviewRequest(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ReviewReturnRequestDto reviewDto
    ) {
        return ResponseEntity.ok(returnExchangeService.reviewReturnRequest(id, getUserId(authentication), reviewDto));
    }
}

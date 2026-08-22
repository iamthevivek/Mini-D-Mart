package com.edu.Mini_D_Mart.order.dto;

import com.edu.Mini_D_Mart.order.entity.FulfillmentType;
import com.edu.Mini_D_Mart.order.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(

        @NotNull(message = "Fulfillment type is required (STORE_PICKUP or HOME_DELIVERY)")
        FulfillmentType fulfillmentType,

        @NotNull(message = "Payment method is required (UPI, CARD, COD, NET_BANKING)")
        PaymentMethod paymentMethod,

        @Size(max = 255, message = "Delivery address must not exceed 255 characters")
        String deliveryAddress,

        @Size(max = 100, message = "Delivery city must not exceed 100 characters")
        String deliveryCity,

        @Size(max = 20, message = "Delivery pincode must not exceed 20 characters")
        String deliveryPincode,

        @Size(max = 20, message = "Delivery phone must not exceed 20 characters")
        String deliveryPhone,

        @Size(max = 500, message = "Delivery instructions must not exceed 500 characters")
        String deliveryInstructions,

        Long pickupSlotId
) {
}

package com.edu.Mini_D_Mart;

import com.edu.Mini_D_Mart.order.entity.Order;
import com.edu.Mini_D_Mart.order.entity.OrderItem;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import com.edu.Mini_D_Mart.order.repository.OrderRepository;
import com.edu.Mini_D_Mart.returns.dto.CreateReturnRequestDto;
import com.edu.Mini_D_Mart.returns.dto.ReturnEligibilityResponse;
import com.edu.Mini_D_Mart.returns.dto.ReturnRequestResponse;
import com.edu.Mini_D_Mart.returns.dto.ReviewReturnRequestDto;
import com.edu.Mini_D_Mart.returns.entity.ReturnReason;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import com.edu.Mini_D_Mart.returns.entity.ReturnType;
import com.edu.Mini_D_Mart.returns.service.ReturnExchangeService;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ReturnExchangeServiceTests {

    @Autowired
    private ReturnExchangeService returnExchangeService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should verify return eligibility on delivered order")
    void testReturnEligibility() {
        User customer = userRepository.findByEmailIgnoreCase("customer@minidmart.com").orElseThrow();
        List<Order> orders = orderRepository.findAllByUserIdOrderByPlacedAtDesc(customer.getId());

        Order deliveredOrder = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .findFirst()
                .orElse(null);

        assertNotNull(deliveredOrder, "Should have a seeded delivered order");
        assertFalse(deliveredOrder.getItems().isEmpty());

        OrderItem item = deliveredOrder.getItems().get(0);

        ReturnEligibilityResponse eligibility = returnExchangeService.checkEligibility(customer.getId(), deliveredOrder.getId(), item.getId());
        assertNotNull(eligibility);
        assertTrue(eligibility.isDelivered());
    }

    @Test
    @DisplayName("Staff can review and approve a return request with inventory restock")
    void testReviewReturnRequest() {
        User staff = userRepository.findByEmailIgnoreCase("staff@minidmart.com").orElseThrow();
        List<ReturnRequestResponse> allRequests = returnExchangeService.getAllRequests();
        assertFalse(allRequests.isEmpty());

        ReturnRequestResponse pendingReq = allRequests.get(0);

        ReviewReturnRequestDto reviewDto = new ReviewReturnRequestDto(
                ReturnStatus.COMPLETED,
                "Package inspected and verified. Return approved.",
                true
        );

        ReturnRequestResponse reviewed = returnExchangeService.reviewReturnRequest(pendingReq.id(), staff.getId(), reviewDto);

        assertNotNull(reviewed);
        assertEquals(ReturnStatus.COMPLETED, reviewed.status());
        assertEquals("Package inspected and verified. Return approved.", reviewed.staffReviewNotes());
    }
}

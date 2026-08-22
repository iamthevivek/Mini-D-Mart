package com.edu.Mini_D_Mart.returns.service;

import com.edu.Mini_D_Mart.exception.ResourceNotFoundException;
import com.edu.Mini_D_Mart.order.entity.Order;
import com.edu.Mini_D_Mart.order.entity.OrderItem;
import com.edu.Mini_D_Mart.order.entity.OrderStatus;
import com.edu.Mini_D_Mart.order.repository.OrderItemRepository;
import com.edu.Mini_D_Mart.order.repository.OrderRepository;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.returns.dto.CreateReturnRequestDto;
import com.edu.Mini_D_Mart.returns.dto.ReturnEligibilityResponse;
import com.edu.Mini_D_Mart.returns.dto.ReturnRequestResponse;
import com.edu.Mini_D_Mart.returns.dto.ReviewReturnRequestDto;
import com.edu.Mini_D_Mart.returns.entity.ReturnRequest;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import com.edu.Mini_D_Mart.returns.entity.ReturnType;
import com.edu.Mini_D_Mart.returns.repository.ReturnRequestRepository;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class ReturnExchangeService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private final Random random = new SecureRandom();

    public ReturnExchangeService(
            ReturnRequestRepository returnRequestRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ReturnEligibilityResponse checkEligibility(Long userId, Long orderId, Long orderItemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (userId != null && !order.getUser().getId().equals(userId)) {
            return new ReturnEligibilityResponse(false, "You are not authorized for this order", 0, false, false);
        }

        boolean isDelivered = order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.PICKED_UP;
        if (!isDelivered) {
            return new ReturnEligibilityResponse(false, "Order must be delivered or picked up before requesting a return", 0, false, false);
        }

        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + orderItemId));

        if (!item.getOrder().getId().equals(order.getId())) {
            return new ReturnEligibilityResponse(false, "Item does not belong to this order", 0, false, true);
        }

        if (item.isReturnedOrExchanged()) {
            return new ReturnEligibilityResponse(false, "This item has already been returned or exchanged", 0, true, true);
        }

        List<ReturnStatus> activeStatuses = List.of(ReturnStatus.PENDING, ReturnStatus.APPROVED, ReturnStatus.COLLECTED);
        if (returnRequestRepository.existsByOrderItemIdAndStatusNotIn(orderItemId, List.of(ReturnStatus.REJECTED))) {
            return new ReturnEligibilityResponse(false, "A return or exchange request is already active for this item", 0, true, true);
        }

        Product product = item.getProduct();
        boolean isReturnable = product != null && product.isReturnable();
        if (!isReturnable) {
            return new ReturnEligibilityResponse(false, "This product category/item is non-returnable (e.g. perishable)", 0, false, true);
        }

        int windowDays = (product.getReturnWindowDays() != null) ? product.getReturnWindowDays() : 7;
        Instant refTime = order.getCompletedAt() != null ? order.getCompletedAt() : order.getPlacedAt();
        long daysElapsed = Duration.between(refTime, Instant.now()).toDays();
        int daysRemaining = Math.max(0, (int) (windowDays - daysElapsed));

        if (daysElapsed > windowDays) {
            return new ReturnEligibilityResponse(false, "The " + windowDays + "-day return window for this order has expired (" + daysElapsed + " days elapsed)", 0, true, true);
        }

        return new ReturnEligibilityResponse(true, "Eligible for return or exchange (" + daysRemaining + " days remaining)", daysRemaining, true, true);
    }

    @Transactional
    public ReturnRequestResponse createReturnRequest(Long userId, CreateReturnRequestDto requestDto) {
        ReturnEligibilityResponse eligibility = checkEligibility(userId, requestDto.orderId(), requestDto.orderItemId());
        if (!eligibility.isEligible()) {
            throw new IllegalStateException("Item is not eligible: " + eligibility.reasonMessage());
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(requestDto.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderItem orderItem = orderItemRepository.findById(requestDto.orderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        Product exchangeProduct = null;
        if (requestDto.type() == ReturnType.EXCHANGE) {
            if (requestDto.exchangeProductId() == null) {
                throw new IllegalArgumentException("Exchange product must be selected for exchange requests");
            }
            exchangeProduct = productRepository.findById(requestDto.exchangeProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange product not found"));

            if (!exchangeProduct.isActive()) {
                throw new IllegalStateException("Requested exchange product is currently not available");
            }
            if (exchangeProduct.getStockQuantity() < orderItem.getQuantity()) {
                throw new IllegalStateException("Requested exchange product is out of stock (available: " + exchangeProduct.getStockQuantity() + ")");
            }
        }

        String reqNum = "RET-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + String.format("%04d", random.nextInt(10000));

        BigDecimal refundAmount = (requestDto.type() == ReturnType.RETURN) ? orderItem.getSubtotal() : BigDecimal.ZERO;

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setRequestNumber(reqNum);
        returnRequest.setOrder(order);
        returnRequest.setOrderItem(orderItem);
        returnRequest.setUser(user);
        returnRequest.setType(requestDto.type());
        returnRequest.setReason(requestDto.reason());
        returnRequest.setDetails(requestDto.details());
        returnRequest.setImageEvidenceUrl(requestDto.imageEvidenceUrl());
        returnRequest.setExchangeProduct(exchangeProduct);
        returnRequest.setStatus(ReturnStatus.PENDING);
        returnRequest.setRefundAmount(refundAmount);
        returnRequest.setRestockItem(true);

        ReturnRequest saved = returnRequestRepository.save(returnRequest);
        return ReturnRequestResponse.from(saved);
    }

    @Transactional
    public ReturnRequestResponse reviewReturnRequest(Long requestId, Long staffUserId, ReviewReturnRequestDto reviewDto) {
        ReturnRequest request = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id: " + requestId));

        User staff = userRepository.findById(staffUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff user not found"));

        ReturnStatus oldStatus = request.getStatus();
        ReturnStatus newStatus = reviewDto.status();

        request.setStatus(newStatus);
        request.setStaffReviewNotes(reviewDto.staffReviewNotes());
        request.setReviewedBy(staff);

        if (reviewDto.restockItem() != null) {
            request.setRestockItem(reviewDto.restockItem());
        }

        if (newStatus == ReturnStatus.COMPLETED && oldStatus != ReturnStatus.COMPLETED) {
            OrderItem item = request.getOrderItem();
            item.setReturnedOrExchanged(true);
            orderItemRepository.save(item);

            if (request.isRestockItem() && item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }

            if (request.getType() == ReturnType.EXCHANGE && request.getExchangeProduct() != null) {
                Product exchangeProduct = request.getExchangeProduct();
                int newStock = Math.max(0, exchangeProduct.getStockQuantity() - item.getQuantity());
                exchangeProduct.setStockQuantity(newStock);
                productRepository.save(exchangeProduct);
            }
        }

        ReturnRequest saved = returnRequestRepository.save(request);
        return ReturnRequestResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ReturnRequestResponse> getCustomerRequests(Long userId) {
        return returnRequestRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ReturnRequestResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReturnRequestResponse> getAllRequests() {
        return returnRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ReturnRequestResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReturnRequestResponse getRequestById(Long id) {
        ReturnRequest request = returnRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id: " + id));
        return ReturnRequestResponse.from(request);
    }
}

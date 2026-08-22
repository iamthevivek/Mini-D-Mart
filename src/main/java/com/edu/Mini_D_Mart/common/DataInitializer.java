package com.edu.Mini_D_Mart.common;

import com.edu.Mini_D_Mart.audit.entity.AuditLog;
import com.edu.Mini_D_Mart.audit.repository.AuditLogRepository;
import com.edu.Mini_D_Mart.category.entity.Category;
import com.edu.Mini_D_Mart.category.repository.CategoryRepository;
import com.edu.Mini_D_Mart.order.entity.*;
import com.edu.Mini_D_Mart.order.repository.OrderItemRepository;
import com.edu.Mini_D_Mart.order.repository.OrderRepository;
import com.edu.Mini_D_Mart.order.repository.PickupSlotRepository;
import com.edu.Mini_D_Mart.product.entity.Product;
import com.edu.Mini_D_Mart.product.repository.ProductRepository;
import com.edu.Mini_D_Mart.returns.entity.ReturnReason;
import com.edu.Mini_D_Mart.returns.entity.ReturnRequest;
import com.edu.Mini_D_Mart.returns.entity.ReturnStatus;
import com.edu.Mini_D_Mart.returns.entity.ReturnType;
import com.edu.Mini_D_Mart.returns.repository.ReturnRequestRepository;
import com.edu.Mini_D_Mart.user.entity.Role;
import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            PickupSlotRepository pickupSlotRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ReturnRequestRepository returnRequestRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.returnRequestRepository = returnRequestRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndProducts();
        }
        if (pickupSlotRepository.count() == 0) {
            seedPickupSlots();
        }
        if (orderRepository.count() == 0) {
            seedSampleOrdersAndReturns();
        }
        if (auditLogRepository.count() == 0) {
            seedAuditLogs();
        }
    }

    private void seedUsers() {
        createUser("Admin User", "admin@minidmart.com", "Admin@1234", "+91 98765 00001", Role.ADMIN);
        createUser("Store Manager", "manager@minidmart.com", "Manager@1234", "+91 98765 00002", Role.MANAGER);
        createUser("Staff Associate", "staff@minidmart.com", "Staff@1234", "+91 98765 00003", Role.STAFF);
        createUser("John Customer", "customer@minidmart.com", "Customer@1234", "+91 98765 00004", Role.CUSTOMER);
    }

    private void createUser(String name, String email, String rawPassword, String phone, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(phone);
        user.setRole(role);
        user.setActive(true);
        userRepository.save(user);
    }

    private void seedCategoriesAndProducts() {
        Category fruitsVeg = createCategory("Fruits & Vegetables", "Fresh farm-picked fruits and fresh vegetables", "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop");
        Category dairyBakery = createCategory("Dairy & Bakery", "Milk, butter, paneer, artisan bread and bakery delights", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop");
        Category staplesGrains = createCategory("Staples & Grains", "Rice, wheat flour, organic pulses, cooking oils and spices", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop");
        Category snacksBev = createCategory("Snacks & Beverages", "Chips, cookies, tea, coffee, cold drinks and juices", "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=500&auto=format&fit=crop");
        Category personalCare = createCategory("Personal Care", "Soaps, shampoos, oral care and hygiene products", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop");
        Category household = createCategory("Household Essentials", "Detergents, floor cleaners, kitchenware and disposables", "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop");

        createProduct("Fresh Alphonso Mangoes", "Premium sweet Alphonso mangoes directly from Ratnagiri farms.", fruitsVeg, "DM-FRU-001", "890123400001", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop", "1 kg (approx 4 pcs)", new BigDecimal("450.00"), new BigDecimal("380.00"), 35, 10, false, 0);
        createProduct("Fresh Red Apples", "Crisp, juicy and sweet Shimla apples rich in antioxidants.", fruitsVeg, "DM-FRU-002", "890123400002", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop", "1 kg", new BigDecimal("180.00"), new BigDecimal("149.00"), 45, 10, false, 0);
        createProduct("Organic Farm Bananas", "Naturally ripened Robusta bananas packed with potassium.", fruitsVeg, "DM-FRU-003", "890123400003", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop", "1 Dozen", new BigDecimal("70.00"), new BigDecimal("55.00"), 50, 10, false, 0);
        createProduct("Fresh Hybrid Tomatoes", "Firm, glossy red tomatoes ideal for curries, salads and soups.", fruitsVeg, "DM-VEG-001", "890123400004", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop", "1 kg", new BigDecimal("40.00"), new BigDecimal("28.00"), 60, 15, false, 0);
        createProduct("Fresh Red Onions", "High-pungency clean red onions for authentic everyday cooking.", fruitsVeg, "DM-VEG-002", "890123400005", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop", "2 kg Net", new BigDecimal("80.00"), new BigDecimal("65.00"), 80, 15, false, 0);
        createProduct("Fresh Farm Potatoes", "Premium dirt-free golden potatoes suitable for baking and frying.", fruitsVeg, "DM-VEG-003", "890123400006", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop", "2 kg Net", new BigDecimal("70.00"), new BigDecimal("54.00"), 75, 15, false, 0);

        createProduct("Amul Taaza Homogenised Toned Milk", "UHT treated pure toned milk with long shelf life.", dairyBakery, "DM-DAI-001", "890123400007", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop", "1 L Tetrapack", new BigDecimal("74.00"), new BigDecimal("68.00"), 50, 15, false, 0);
        createProduct("Amul Salted Butter", "Delicious creamy pasteurized butter made from pure milk fat.", dairyBakery, "DM-DAI-002", "890123400008", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop", "500 g", new BigDecimal("275.00"), new BigDecimal("255.00"), 40, 10, true, 3);
        createProduct("Fresh Malai Paneer", "Soft, succulent cottage cheese cubes rich in protein.", dairyBakery, "DM-DAI-003", "890123400009", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop", "200 g", new BigDecimal("95.00"), new BigDecimal("85.00"), 30, 8, false, 0);
        createProduct("Whole Wheat Multi-Grain Bread", "100% whole grain loaf with seeds, baked fresh daily.", dairyBakery, "DM-BAK-001", "890123400010", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop", "400 g", new BigDecimal("55.00"), new BigDecimal("48.00"), 25, 5, false, 0);

        createProduct("Fortune Sunlite Refined Sunflower Oil", "Light and healthy cooking oil enriched with vitamins A & D.", staplesGrains, "DM-STA-001", "890123400011", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop", "1 L Pouch", new BigDecimal("165.00"), new BigDecimal("139.00"), 65, 12, true, 7);
        createProduct("Daawat Rozana Super Basmati Rice", "Aromatic long grain basmati rice perfect for daily meals.", staplesGrains, "DM-STA-002", "890123400012", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", "5 kg Bag", new BigDecimal("499.00"), new BigDecimal("399.00"), 40, 8, true, 7);
        createProduct("Aashirvaad Shudh Chakki Atta", "100% whole wheat flour ground to perfection for soft rotis.", staplesGrains, "DM-STA-003", "890123400013", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop", "5 kg Bag", new BigDecimal("260.00"), new BigDecimal("235.00"), 55, 10, true, 7);
        createProduct("Tata Salt Vacuum Evaporated", "Iodized crystal salt providing essential mental development.", staplesGrains, "DM-STA-004", "890123400014", "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop", "1 kg", new BigDecimal("28.00"), new BigDecimal("24.00"), 100, 20, true, 7);
        createProduct("Organic Toor Dal (Pigeon Pea)", "Unpolished high-protein toor dal for rich creamy dal tadka.", staplesGrains, "DM-STA-005", "890123400015", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop", "1 kg", new BigDecimal("190.00"), new BigDecimal("165.00"), 4, 10, true, 7);

        createProduct("Lay's Classic Salted Potato Chips", "Crunchy golden potato chips seasoned with natural salt.", snacksBev, "DM-SNA-001", "890123400016", "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop", "115 g Party Pack", new BigDecimal("50.00"), new BigDecimal("42.00"), 60, 15, true, 7);
        createProduct("Oreo Vanilla Creme Biscuits", "Rich dark chocolate cookies filled with smooth vanilla cream.", snacksBev, "DM-SNA-002", "890123400017", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop", "300 g Family Pack", new BigDecimal("90.00"), new BigDecimal("75.00"), 50, 10, true, 7);
        createProduct("Nescafe Classic Instant Coffee", "100% pure coffee beans for a rich and aromatic coffee experience.", snacksBev, "DM-BEV-001", "890123400018", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop", "100 g Glass Jar", new BigDecimal("360.00"), new BigDecimal("299.00"), 35, 8, true, 7);
        createProduct("Taj Mahal Tea Pouch", "Carefully selected premium orange pekoe tea leaves for rich liquor.", snacksBev, "DM-BEV-002", "890123400019", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop", "500 g", new BigDecimal("320.00"), new BigDecimal("275.00"), 30, 8, true, 7);

        createProduct("Dove Deep Moisture Body Wash", "Nourishing body cleanser with nutrium moisture for radiant skin.", personalCare, "DM-PC-001", "890123400020", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop", "800 ml Bottle", new BigDecimal("499.00"), new BigDecimal("399.00"), 40, 10, true, 7);
        createProduct("Colgate Total Dental Cavity Toothpaste", "12-hour antibacterial whole mouth shield for complete oral care.", personalCare, "DM-PC-002", "890123400021", "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&auto=format&fit=crop", "150 g x 2 Twin Pack", new BigDecimal("220.00"), new BigDecimal("175.00"), 50, 12, true, 7);
        createProduct("Head & Shoulders Smooth & Silky Shampoo", "Anti-dandruff formula with 24-hour frizz control.", personalCare, "DM-PC-003", "890123400022", "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop", "650 ml Pump", new BigDecimal("550.00"), new BigDecimal("440.00"), 3, 10, true, 7);

        createProduct("Surf Excel Matic Top Load Detergent", "Superior liquid detergent for tough stain removal in washing machines.", household, "DM-HOU-001", "890123400023", "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop", "2 L Bottle", new BigDecimal("460.00"), new BigDecimal("385.00"), 45, 10, true, 7);
        createProduct("Lizol Disinfectant Surface Cleaner Citrus", "Kills 99.9% germs with long lasting fragrant citrus freshness.", household, "DM-HOU-002", "890123400024", "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop", "2 L Jar", new BigDecimal("390.00"), new BigDecimal("320.00"), 35, 10, true, 7);
        createProduct("Vim Lemon Dishwash Gel", "Power of 100 lemons removing stubborn grease in 1 spoon.", household, "DM-HOU-003", "890123400025", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop", "750 ml Bottle", new BigDecimal("185.00"), new BigDecimal("155.00"), 60, 15, true, 7);
    }

    private Category createCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    private void createProduct(
            String name, String description, Category category,
            String sku, String barcode, String imageUrl, String unit,
            BigDecimal mrp, BigDecimal selling,
            int stock, int lowThreshold, boolean isReturnable, int returnDays
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setSku(sku);
        product.setBarcode(barcode);
        product.setImageUrl(imageUrl);
        product.setUnit(unit);
        product.setMrpPrice(mrp);
        product.setSellingPrice(selling);
        product.setStockQuantity(stock);
        product.setLowStockThreshold(lowThreshold);
        product.setReturnable(isReturnable);
        product.setReturnWindowDays(returnDays);
        product.setActive(true);
        productRepository.save(product);
    }

    private void seedPickupSlots() {
        LocalDate today = LocalDate.now();
        LocalTime[][] times = {
                {LocalTime.of(9, 0), LocalTime.of(11, 0)},
                {LocalTime.of(11, 0), LocalTime.of(13, 0)},
                {LocalTime.of(14, 0), LocalTime.of(16, 0)},
                {LocalTime.of(16, 0), LocalTime.of(18, 0)},
                {LocalTime.of(18, 0), LocalTime.of(20, 0)}
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = today.plusDays(i);
            for (LocalTime[] slotTime : times) {
                PickupSlot slot = new PickupSlot(date, slotTime[0], slotTime[1], 20);
                pickupSlotRepository.save(slot);
            }
        }
    }

    private void seedSampleOrdersAndReturns() {
        User customer = userRepository.findByEmailIgnoreCase("customer@minidmart.com").orElse(null);
        if (customer == null) return;

        List<Product> products = productRepository.findAll();
        if (products.size() < 5) return;

        List<PickupSlot> slots = pickupSlotRepository.findAll();

        Order deliveredOrder = new Order();
        deliveredOrder.setOrderNumber("DM-20260820-8012");
        deliveredOrder.setUser(customer);
        deliveredOrder.setFulfillmentType(FulfillmentType.HOME_DELIVERY);
        deliveredOrder.setStatus(OrderStatus.DELIVERED);
        deliveredOrder.setDeliveryAddress("Flat 402, Sunshine Apartments, MG Road");
        deliveredOrder.setDeliveryCity("Mumbai");
        deliveredOrder.setDeliveryPincode("400001");
        deliveredOrder.setDeliveryPhone("+91 98765 00004");
        deliveredOrder.setDeliveryInstructions("Leave package with security gate");
        deliveredOrder.setPaymentMethod(PaymentMethod.UPI);
        deliveredOrder.setPaymentStatus(PaymentStatus.PAID);
        deliveredOrder.setPlacedAt(Instant.now().minus(2, ChronoUnit.DAYS));
        deliveredOrder.setCompletedAt(Instant.now().minus(1, ChronoUnit.DAYS));

        Product p1 = products.get(10);
        Product p2 = products.get(11);
        BigDecimal subtotal1 = p1.getSellingPrice().add(p2.getSellingPrice());
        deliveredOrder.setSubtotal(subtotal1);
        deliveredOrder.setDeliveryFee(BigDecimal.ZERO);
        deliveredOrder.setTaxAmount(subtotal1.multiply(BigDecimal.valueOf(0.05)));
        deliveredOrder.setTotalAmount(subtotal1.add(deliveredOrder.getTaxAmount()));

        OrderItem item1 = new OrderItem();
        item1.setProduct(p1);
        item1.setProductName(p1.getName());
        item1.setProductSku(p1.getSku());
        item1.setProductImageUrl(p1.getImageUrl());
        item1.setUnit(p1.getUnit());
        item1.setUnitPrice(p1.getSellingPrice());
        item1.setQuantity(1);
        item1.setSubtotal(p1.getSellingPrice());
        deliveredOrder.addItem(item1);

        OrderItem item2 = new OrderItem();
        item2.setProduct(p2);
        item2.setProductName(p2.getName());
        item2.setProductSku(p2.getSku());
        item2.setProductImageUrl(p2.getImageUrl());
        item2.setUnit(p2.getUnit());
        item2.setUnitPrice(p2.getSellingPrice());
        item2.setQuantity(1);
        item2.setSubtotal(p2.getSellingPrice());
        deliveredOrder.addItem(item2);

        Order savedDelivered = orderRepository.save(deliveredOrder);

        if (!slots.isEmpty()) {
            PickupSlot slot = slots.get(0);
            slot.setBookedCount(slot.getBookedCount() + 1);
            pickupSlotRepository.save(slot);

            Order pickupOrder = new Order();
            pickupOrder.setOrderNumber("DM-20260822-4091");
            pickupOrder.setUser(customer);
            pickupOrder.setFulfillmentType(FulfillmentType.STORE_PICKUP);
            pickupOrder.setStatus(OrderStatus.READY_FOR_PICKUP);
            pickupOrder.setPickupSlot(slot);
            pickupOrder.setPickupVerificationCode("748291");
            pickupOrder.setPaymentMethod(PaymentMethod.CARD);
            pickupOrder.setPaymentStatus(PaymentStatus.PAID);
            pickupOrder.setPlacedAt(Instant.now().minus(4, ChronoUnit.HOURS));

            Product p3 = products.get(7);
            Product p4 = products.get(15);
            BigDecimal subtotal2 = p3.getSellingPrice().add(p4.getSellingPrice());
            pickupOrder.setSubtotal(subtotal2);
            pickupOrder.setDeliveryFee(BigDecimal.ZERO);
            pickupOrder.setTaxAmount(subtotal2.multiply(BigDecimal.valueOf(0.05)));
            pickupOrder.setTotalAmount(subtotal2.add(pickupOrder.getTaxAmount()));

            OrderItem item3 = new OrderItem();
            item3.setProduct(p3);
            item3.setProductName(p3.getName());
            item3.setProductSku(p3.getSku());
            item3.setProductImageUrl(p3.getImageUrl());
            item3.setUnit(p3.getUnit());
            item3.setUnitPrice(p3.getSellingPrice());
            item3.setQuantity(1);
            item3.setSubtotal(p3.getSellingPrice());
            pickupOrder.addItem(item3);

            OrderItem item4 = new OrderItem();
            item4.setProduct(p4);
            item4.setProductName(p4.getName());
            item4.setProductSku(p4.getSku());
            item4.setProductImageUrl(p4.getImageUrl());
            item4.setUnit(p4.getUnit());
            item4.setUnitPrice(p4.getSellingPrice());
            item4.setQuantity(1);
            item4.setSubtotal(p4.getSellingPrice());
            pickupOrder.addItem(item4);

            orderRepository.save(pickupOrder);
        }

        ReturnRequest returnReq = new ReturnRequest();
        returnReq.setRequestNumber("RET-20260821-1002");
        returnReq.setOrder(savedDelivered);
        returnReq.setOrderItem(savedDelivered.getItems().get(0));
        returnReq.setUser(customer);
        returnReq.setType(ReturnType.RETURN);
        returnReq.setReason(ReturnReason.DAMAGED);
        returnReq.setDetails("Packaging seal was slightly torn upon delivery.");
        returnReq.setStatus(ReturnStatus.PENDING);
        returnReq.setRefundAmount(savedDelivered.getItems().get(0).getSubtotal());
        returnReq.setRestockItem(false);
        returnRequestRepository.save(returnReq);
    }

    private void seedAuditLogs() {
        auditLogRepository.save(new AuditLog(
                "SYSTEM_BOOTSTRAP",
                "SystemConfig",
                "1",
                1L,
                "admin@minidmart.com",
                "ADMIN",
                "127.0.0.1",
                "Initialized Mini D-Mart application security and BCrypt encoder policies"
        ));
        auditLogRepository.save(new AuditLog(
                "CATALOG_SEEDED",
                "ProductCatalog",
                "25",
                1L,
                "admin@minidmart.com",
                "ADMIN",
                "127.0.0.1",
                "Configured 6 grocery categories and 25 catalog products with pricing"
        ));
        auditLogRepository.save(new AuditLog(
                "SLOTS_CONFIGURED",
                "PickupSlot",
                "35",
                2L,
                "manager@minidmart.com",
                "MANAGER",
                "127.0.0.1",
                "Configured 35 express store pickup capacity slots across 7 operating days"
        ));
        auditLogRepository.save(new AuditLog(
                "ORDER_PLACED",
                "Order",
                "DM-20260820-8012",
                4L,
                "customer@minidmart.com",
                "CUSTOMER",
                "192.168.1.10",
                "Placed Home Delivery order containing 2 grocery items (Total: ₹837.90)"
        ));
        auditLogRepository.save(new AuditLog(
                "ORDER_DISPATCHED",
                "Order",
                "DM-20260820-8012",
                3L,
                "staff@minidmart.com",
                "STAFF",
                "127.0.0.1",
                "Verified and dispatched order package for doorstep delivery"
        ));
        auditLogRepository.save(new AuditLog(
                "RETURN_REGISTERED",
                "ReturnRequest",
                "RET-20260821-1002",
                4L,
                "customer@minidmart.com",
                "CUSTOMER",
                "192.168.1.10",
                "Submitted return request for Fortune Oil due to packaging seal tear"
        ));
    }
}

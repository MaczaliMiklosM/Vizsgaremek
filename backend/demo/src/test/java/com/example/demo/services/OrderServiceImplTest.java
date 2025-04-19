package com.example.demo.services;

import com.example.demo.dto.order.OrderItemDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private OrderHeaderRepository orderHeaderRepository;

    @Mock
    private OrderBodyRepository orderBodyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private CollectionService collectionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrder_shouldThrowException_whenUserNotFound() {
        OrderRequestDTO request = new OrderRequestDTO();
        request.setUserId(1);
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.createOrder(request));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void createOrder_shouldThrowException_whenProductIsSold() {
        User user = new User();
        user.setId(1);

        Product soldProduct = new Product();
        soldProduct.setId(10);
        soldProduct.setStatus(Status.SOLD);

        OrderItemDTO item = new OrderItemDTO(10, 100, 1, null, null);
        OrderRequestDTO request = new OrderRequestDTO(1, "address", List.of(item));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(productRepository.findById(10)).thenReturn(Optional.of(soldProduct));
        when(orderHeaderRepository.save(any())).thenReturn(new OrderHeader());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.createOrder(request));
        assertTrue(ex.getMessage().contains("already sold"));
    }

    @Test
    void getOrderById_shouldReturnOrder() {
        Product product = new Product();
        product.setId(1);
        product.setName("Product A");
        product.setStatus(Status.APPROVED);
        product.setPrice(100.0);

        OrderBody body = OrderBody.builder()
                .id(1)
                .product(product)
                .unitPrice(100)
                .quantity(1)
                .build();

        User user = new User();
        user.setId(1);

        OrderHeader order = OrderHeader.builder()
                .orderId(1)
                .user(user)
                .shippingAddress("Test Address")
                .status(OrderStatus.PROCESSING)
                .totalAmount(100)
                .items(List.of(body))
                .build();

        when(orderHeaderRepository.findById(1)).thenReturn(Optional.of(order));

        OrderResponseDTO response = orderService.getOrderById(1);

        assertEquals(1, response.getOrderId());
        assertEquals("Test Address", response.getShippingAddress());
        assertEquals(1, response.getItems().size());
        assertEquals("Product A", response.getItems().get(0).getProductName());
    }

    @Test
    void getOrderById_shouldThrow_whenNotFound() {
        when(orderHeaderRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.getOrderById(99));
        assertEquals("Order not found", ex.getMessage());
    }

    @Test
    void getAllOrders_shouldReturnOrders() {
        OrderHeader order1 = new OrderHeader();
        order1.setOrderId(1);
        order1.setUser(new User());
        order1.setItems(new ArrayList<>());

        when(orderHeaderRepository.findAll()).thenReturn(List.of(order1));
        when(orderHeaderRepository.findById(1)).thenReturn(Optional.of(order1));

        List<OrderResponseDTO> list = orderService.getAllOrders();

        assertEquals(1, list.size());
        assertEquals(1, list.get(0).getOrderId());
    }

    @Test
    void addToCart_shouldAddProductToCart_whenValidInput() {
        Integer userId = 1;
        Integer productId = 10;

        User user = new User();
        user.setId(userId);

        Product product = new Product();
        product.setId(productId);
        product.setStatus(Status.APPROVED);
        product.setPrice(100.0);

        OrderHeader cart = OrderHeader.builder()
                .orderId(1)
                .user(user)
                .status(OrderStatus.CART)
                .totalAmount(0)
                .items(new ArrayList<>())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(orderHeaderRepository.findByUserAndStatus(user, OrderStatus.CART)).thenReturn(Optional.of(cart));
        when(orderBodyRepository.findByOrder_User_IdAndProductId(userId, productId)).thenReturn(Optional.empty());

        orderService.addToCart(userId, productId);

        verify(orderBodyRepository).save(any(OrderBody.class));
        verify(orderHeaderRepository).save(any(OrderHeader.class));
    }

}

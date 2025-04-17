package com.example.demo.controller;

import com.example.demo.dto.order.AddToCartRequestDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.services.NotificationService;
import com.example.demo.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.OrderHeader;
import com.example.demo.repository.OrderHeaderRepository;
import org.springframework.security.access.prepost.PreAuthorize; // ez is kell

import io.swagger.annotations.ApiOperation;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final NotificationService notificationService;
    private final OrderService orderService;

    @ApiOperation(value = "Create a new order",
            notes = "This endpoint allows a user to create a new order with the provided order details. The quantity is always set to 1.")
    @PostMapping("/createOrder")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @ApiOperation(value = "Get an order by ID",
            notes = "This endpoint retrieves an order by its unique order ID. You need to provide the order ID to fetch the order details.")
    @GetMapping("/getOrderById/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @ApiOperation(value = "Add product to user's cart",
            notes = "This endpoint stores a product in a CART order for the given user.")
    @PostMapping("/addToCart")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequestDTO request) {
        orderService.addToCart(request.getUserId(), request.getProductId());
        return ResponseEntity.ok().build();
    }


    @ApiOperation(value = "Get all orders of a user",
            notes = "This endpoint returns a list of orders based on the user's ID. You need to provide the user ID to retrieve their orders.")
    @GetMapping("/getAllOrdersById/{user_id}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Integer user_id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(user_id));
    }

    @ApiOperation(value = "Get all orders in the system",
            notes = "This endpoint retrieves all orders in the system. Admin access is required to view all orders.")
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @Autowired
    private OrderHeaderRepository orderHeaderRepository;

    @PutMapping("/admin/updateStatus/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam("status") String status) {
        OrderHeader order = orderHeaderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderHeaderRepository.save(order);

            // ✅ Értesítés küldése
            notificationService.sendNotification(
                    order.getUser(),
                    "Your order #" + order.getOrderId() + " status was updated to: " + newStatus.name()
            );

            return ResponseEntity.ok("Order status updated to " + newStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + status);
        }
    }


}

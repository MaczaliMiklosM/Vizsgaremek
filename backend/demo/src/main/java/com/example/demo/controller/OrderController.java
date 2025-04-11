package com.example.demo.controller;

import com.example.demo.dto.OrderRequestDTO;
import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.annotations.ApiOperation;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

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
}

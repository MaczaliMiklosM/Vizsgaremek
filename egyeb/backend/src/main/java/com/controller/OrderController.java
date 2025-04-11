package com.luxcollect.controller;

import com.luxcollect.model.Order;
import com.luxcollect.model.User;
import com.luxcollect.service.OrderService;
import com.luxcollect.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Order> placeOrder(@PathVariable Long userId, @RequestBody Order order) {
        return userService.findUserById(userId)
                .map(user -> ResponseEntity.ok(orderService.createOrder(user, order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return userService.findUserById(userId)
                .map(user -> ResponseEntity.ok(orderService.getOrdersByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }
}

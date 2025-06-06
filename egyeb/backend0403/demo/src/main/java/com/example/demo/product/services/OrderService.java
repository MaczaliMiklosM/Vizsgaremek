package com.example.demo.product.services;

import com.example.demo.dto.OrderRequestDTO;
import com.example.demo.dto.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO request);
    OrderResponseDTO getOrderById(Integer orderId);
    List<OrderResponseDTO> getOrdersByUserId(Integer userId);
    List<OrderResponseDTO> getAllOrders();
}

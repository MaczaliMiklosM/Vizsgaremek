package com.example.demo.services;

import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO request);
    OrderResponseDTO getOrderById(Integer orderId);
    List<OrderResponseDTO> getOrdersByUserId(Integer userId);
    List<OrderResponseDTO> getAllOrders();
}

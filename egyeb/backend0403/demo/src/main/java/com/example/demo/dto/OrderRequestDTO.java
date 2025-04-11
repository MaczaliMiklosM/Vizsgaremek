package com.example.demo.dto;

import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private Integer userId;
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    private List<OrderItemDTO> items;
}

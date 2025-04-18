package com.example.demo.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Integer productId;
    private Integer unitPrice;
    private Integer quantity = 1;
    private String productName;
    private String productStatus;
}


package com.example.demo.dto.order;

import lombok.Data;

@Data
public class AddToCartRequestDTO {
    private Integer userId;
    private Integer productId;
}

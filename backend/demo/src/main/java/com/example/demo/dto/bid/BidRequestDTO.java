package com.example.demo.dto.bid;

import lombok.Data;

@Data
public class BidRequestDTO {
    private Integer productId;
    private Integer userId;
    private Double amount;
}

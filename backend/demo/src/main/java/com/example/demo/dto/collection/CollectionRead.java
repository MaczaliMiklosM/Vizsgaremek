package com.example.demo.dto.collection;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionRead {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private Double productPrice;
    private String productImageData; // Base64 encoded image
}

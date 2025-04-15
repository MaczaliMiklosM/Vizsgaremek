package com.example.demo.dto.wishlist;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishlistRead {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private Double productPrice;
    private String productImageData; // Base64 encoded image
}

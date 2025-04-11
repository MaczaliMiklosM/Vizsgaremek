package com.example.demo.dto.wishlist;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDelete {
    Integer userId;
    Integer productId;
}
package com.example.demo.controller;


import com.example.demo.product.model.Wishlist;
import com.example.demo.product.services.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(@PathVariable Integer userId) {
        return wishlistService.getWishlistByUserId(userId);
    }

    @PostMapping("/{userId}/{productId}")
    public Wishlist addToWishlist(@PathVariable Integer userId, @PathVariable Integer productId) {
        return wishlistService.addToWishlist(userId, productId);
    }

    @DeleteMapping("/{userId}/{productId}")
    public void removeFromWishlist(@PathVariable Integer userId, @PathVariable Integer productId) {
        wishlistService.removeFromWishlist(userId, productId);
    }
}



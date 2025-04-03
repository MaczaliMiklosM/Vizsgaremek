package com.example.demo.controller;

import com.example.demo.product.model.Product;
import com.example.demo.product.services.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {

    @Autowired
    private WishListService wishlistService;

    @PostMapping("/add")
    public String addToWishlist(@RequestBody Product product) {
        wishlistService.addToWishlist(product);
        return "Termék hozzáadva a kívánságlistához.";
    }

    @GetMapping
    public List<Product> getWishlist() {
        return wishlistService.getWishlist();
    }

    @DeleteMapping("/remove/{productId}")
    public String removeFromWishlist(@PathVariable Integer productId) {
        wishlistService.removeFromWishlist(productId);
        return "Termék eltávolítva a kívánságlistáról.";
    }

    @DeleteMapping("/clear")
    public String clearWishlist() {
        wishlistService.clearWishlist();
        return "Kívánságlista kiürítve.";
    }

    @GetMapping("/contains/{productId}")
    public boolean isInWishlist(@PathVariable Integer productId) {
        return wishlistService.isInWishlist(productId);
    }
}


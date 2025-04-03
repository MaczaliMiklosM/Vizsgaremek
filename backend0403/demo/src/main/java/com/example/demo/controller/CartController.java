package com.example.demo.controller;

import com.example.demo.product.model.CartItem;
import com.example.demo.product.model.Product;
import com.example.demo.product.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public String addToCart(@RequestBody Product product, @RequestParam int quantity) {
        cartService.addProduct(product, quantity);
        return "Termék hozzáadva a kosárhoz.";
    }

    @GetMapping
    public List<CartItem> getCart() {
        return cartService.getCartItems();
    }

    @DeleteMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Integer productId) {
        cartService.removeProduct(productId);
        return "Termék eltávolítva a kosárból.";
    }

    @DeleteMapping("/clear")
    public String clearCart() {
        cartService.clearCart();
        return "Kosár kiürítve.";
    }

    @GetMapping("/total")
    public double getTotal() {
        return cartService.getTotal();
    }
}


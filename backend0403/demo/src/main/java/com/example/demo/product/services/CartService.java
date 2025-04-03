package com.example.demo.product.services;

import com.example.demo.product.model.CartItem;
import com.example.demo.product.model.Product;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CartService {

    private final Map<Integer, CartItem> cart = new HashMap<>();

    public void addProduct(Product product, int quantity) {
        cart.merge(product.getId(),
                new CartItem(product, quantity),
                (existing, newItem) -> {
                    existing.setQuantity(existing.getQuantity() + newItem.getQuantity());
                    return existing;
                });
    }

    public List<CartItem> getCartItems() {
        return new ArrayList<>(cart.values());
    }

    public void removeProduct(Integer productId) {
        cart.remove(productId);
    }

    public void clearCart() {
        cart.clear();
    }

    public double getTotal() {
        return cart.values().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }
}


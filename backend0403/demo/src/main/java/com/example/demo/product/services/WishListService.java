package com.example.demo.product.services;

import com.example.demo.product.model.Product;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class WishListService {

    private final Map<Integer, Product> wishlist = new HashMap<>();

    public void addToWishlist(Product product) {
        wishlist.putIfAbsent(product.getId(), product);
    }

    public List<Product> getWishlist() {
        return new ArrayList<>(wishlist.values());
    }

    public void removeFromWishlist(Integer productId) {
        wishlist.remove(productId);
    }

    public void clearWishlist() {
        wishlist.clear();
    }

    public boolean isInWishlist(Integer productId) {
        return wishlist.containsKey(productId);
    }
}


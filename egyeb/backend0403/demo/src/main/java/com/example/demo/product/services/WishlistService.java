package com.example.demo.product.services;



import com.example.demo.product.model.Wishlist;
import com.example.demo.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public WishlistService(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    public List<Wishlist> getWishlistByUserId(Integer userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public Wishlist addToWishlist(Integer userId, Integer productId) {
        if (wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new IllegalStateException("Product already in wishlist");
        }
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setProductId(productId);
        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Integer userId, Integer productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}



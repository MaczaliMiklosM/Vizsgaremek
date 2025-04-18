package com.example.demo.services;

import com.example.demo.dto.wishlist.WishlistDelete;
import com.example.demo.dto.wishlist.WishlistRead;
import com.example.demo.dto.wishlist.WishlistSave;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.model.Wishlist;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {
    @Autowired
    WishlistRepository wishlistRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    public List<Wishlist> getWishlistById(Integer userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public Wishlist addToWishlist(WishlistSave wishlistSave) {
        User user = userRepository.findById(wishlistSave.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + wishlistSave.getUserId()));

        Product product = productRepository.findById(wishlistSave.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + wishlistSave.getProductId()));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public ResponseEntity<String> removeFromWishlist(WishlistDelete wishlistDelete) {
        Optional<User> user = userRepository.findById(wishlistDelete.getUserId());
        Optional<Product> product = productRepository.findById(wishlistDelete.getProductId());

        if (user.isPresent() && product.isPresent()) {
            Optional<Wishlist> wishlist = wishlistRepository.findByUserIdAndProductId(
                    user.get().getId(), product.get().getId());

            wishlist.ifPresent(wishlistRepository::delete);

            return new ResponseEntity<>("Item removed or already not present", HttpStatus.OK);
        }

        return new ResponseEntity<>("Invalid user or product", HttpStatus.BAD_REQUEST);
    }

}



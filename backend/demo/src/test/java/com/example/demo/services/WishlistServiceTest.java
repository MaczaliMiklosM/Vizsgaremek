package com.example.demo.services;

import com.example.demo.dto.wishlist.WishlistDelete;
import com.example.demo.dto.wishlist.WishlistSave;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.model.Wishlist;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WishlistServiceTest {

    @InjectMocks
    private WishlistService wishlistService;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddToWishlist_Success() {
        WishlistSave save = new WishlistSave();
        save.setUserId(1);
        save.setProductId(2);

        User mockUser = new User();
        mockUser.setId(1);
        Product mockProduct = new Product();
        mockProduct.setId(2);

        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));
        when(productRepository.findById(2)).thenReturn(Optional.of(mockProduct));

        Wishlist savedWishlist = new Wishlist();
        when(wishlistRepository.save(any(Wishlist.class))).thenReturn(savedWishlist);

        Wishlist result = wishlistService.addToWishlist(save);

        assertNotNull(result);
        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    void testRemoveFromWishlist_Success() {
        WishlistDelete delete = new WishlistDelete();
        delete.setUserId(1);
        delete.setProductId(2);

        User mockUser = new User();
        mockUser.setId(1);
        Product mockProduct = new Product();
        mockProduct.setId(2);
        Wishlist mockWishlist = new Wishlist();

        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));
        when(productRepository.findById(2)).thenReturn(Optional.of(mockProduct));
        when(wishlistRepository.findByUserIdAndProductId(1, 2)).thenReturn(Optional.of(mockWishlist));

        ResponseEntity<String> response = wishlistService.removeFromWishlist(delete);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(wishlistRepository).delete(mockWishlist);
    }

    @Test
    void testRemoveFromWishlist_InvalidUserOrProduct() {
        WishlistDelete delete = new WishlistDelete();
        delete.setUserId(1);
        delete.setProductId(2);

        when(userRepository.findById(1)).thenReturn(Optional.empty());
        when(productRepository.findById(2)).thenReturn(Optional.empty());

        ResponseEntity<String> response = wishlistService.removeFromWishlist(delete);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(wishlistRepository, never()).delete(any());
    }
}

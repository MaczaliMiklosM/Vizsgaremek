package com.example.demo.services;

import com.example.demo.enums.Status;
import com.example.demo.model.Bid;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BidServiceTest {

    @InjectMocks
    private BidService bidService;

    @Mock
    private BidRepository bidRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPlaceBid_Success() throws Exception {
        int productId = 1;
        int userId = 2;
        double bidAmount = 101.0;

        Product product = new Product();
        product.setId(productId);
        product.setPrice(200.0);
        product.setStatus(Status.APPROVED);
        User uploader = new User(); uploader.setId(3);
        product.setUser(uploader);

        User user = new User();
        user.setId(userId);

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(bidRepository.existsByProductIdAndBidderIdAndStatus(productId, userId, com.example.demo.enums.BidStatus.PENDING)).thenReturn(false);
        when(bidRepository.save(any(Bid.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Bid result = bidService.placeBid(productId, userId, bidAmount);

        assertNotNull(result);
        assertEquals(user, result.getBidder());
        assertEquals(product, result.getProduct());
        assertEquals(bidAmount, result.getAmount());
        verify(notificationService).sendNotification(eq(uploader), contains("You received a new bid"));
    }

    @Test
    void testPlaceBid_ProductNotFound() {
        when(productRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(Exception.class, () -> bidService.placeBid(1, 2, 50.0));
        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void testPlaceBid_UserNotFound() {
        Product product = new Product();
        product.setId(1);
        product.setPrice(100.0);
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(userRepository.findById(2)).thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class, () -> bidService.placeBid(1, 2, 50.0));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void testPlaceBid_TooLowAmount() {
        Product product = new Product();
        product.setId(1);
        product.setPrice(100.0);
        product.setStatus(Status.APPROVED);
        User user = new User(); user.setId(2);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(bidRepository.existsByProductIdAndBidderIdAndStatus(1, 2, com.example.demo.enums.BidStatus.PENDING)).thenReturn(false);

        Exception ex = assertThrows(Exception.class, () -> bidService.placeBid(1, 2, 20.0));
        assertTrue(ex.getMessage().contains("Bid must be at least half"));
    }
}

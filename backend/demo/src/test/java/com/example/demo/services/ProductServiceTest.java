package com.example.demo.services;

import com.example.demo.dto.product.ProductSave;
import com.example.demo.enums.Status;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private WishlistRepository wishlistRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct_Success() {
        ProductSave save = new ProductSave();
        save.setName("Watch");
        save.setDescription("Luxury watch");
        save.setPrice(1000.0);
        save.setUploaderId(1);

        MockMultipartFile mockFile = new MockMultipartFile(
                "imageData",
                "image.jpg",
                "image/jpeg",
                "fake-image-content".getBytes()
        );
        save.setImageData(mockFile);

        User uploader = new User();
        uploader.setId(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(uploader));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(123);
            return product;
        });

        Product result = productService.createProduct(save);

        assertNotNull(result);
        assertEquals("Watch", result.getName());
        assertEquals(Status.UNAPPROVED, result.getStatus());
        verify(notificationService).sendNotification(eq(uploader), contains("Upload successful"));
    }


    @Test
    void testCreateProduct_UserNotFound() {
        ProductSave save = new ProductSave();
        save.setUploaderId(99);

        when(userRepository.findById(99)).thenReturn(Optional.empty());

        Product result = productService.createProduct(save);

        assertNull(result);
        verify(productRepository, never()).save(any());
    }
}

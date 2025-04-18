package com.example.demo.services;

import com.example.demo.dto.product.ProductSave;
import com.example.demo.enums.Status;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    public ResponseEntity<String> deleteProduct(Integer id) {
        Optional<Product> productOptional = productRepository.findById(id);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            User uploader = product.getUser();

            productRepository.deleteById(id);

            // 🔔 Notify uploader about deletion
            if (uploader != null) {
                notificationService.sendNotification(
                        uploader,
                        "Your product \"" + product.getName() + "\" has been deleted by an admin."
                );
            }

            return new ResponseEntity<>("Product deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.CONFLICT);
        }
    }


    public Product createProduct(ProductSave productSave) {
        Product product = new Product();
        product.setName(productSave.getName());
        product.setDescription(productSave.getDescription());
        product.setPrice(productSave.getPrice());
        product.setBrand(productSave.getBrand());
        product.setColor(productSave.getColor());
        product.setSize(productSave.getSize());
        product.setProductCondition(productSave.getProductCondition());
        product.setUploadDate(LocalDateTime.now());
        product.setCategory(productSave.getCategory());
        product.setTargetGender(productSave.getTargetGender());
        product.setStatus(Status.UNAPPROVED);

        Optional<User> userOptional = userRepository.findById(productSave.getUploaderId());
        if (userOptional.isPresent()) {
            User uploader = userOptional.get();
            product.setUser(uploader);

            try {
                if (productSave.getImageData() != null && !productSave.getImageData().isEmpty()) {
                    product.setImageData(productSave.getImageData().getBytes());
                }
                if (productSave.getImageData2() != null && !productSave.getImageData2().isEmpty()) {
                    product.setImageData2(productSave.getImageData2().getBytes());
                }
                if (productSave.getImageData3() != null && !productSave.getImageData3().isEmpty()) {
                    product.setImageData3(productSave.getImageData3().getBytes());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            Product savedProduct = productRepository.save(product);

            notificationService.sendNotification(
                    uploader,
                    "Upload successful! Your product \"" + savedProduct.getName() + "\" is now awaiting admin approval."
            );

            return savedProduct;
        }
        return null;
    }

    public Optional<Product> getProductOptional(Integer id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getProductsByUserId(Integer userId) {
        return productRepository.findByUser_Id(userId);
    }

    public void approveProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(Status.APPROVED);
        productRepository.save(product);

        // ✅ Értesítés a feltöltőnek
        User uploader = product.getUser();
        notificationService.sendNotification(
                uploader,
                "Your product \"" + product.getName() + "\" has been approved and is now visible on the site!"
        );
    }


}
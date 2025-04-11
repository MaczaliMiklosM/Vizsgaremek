package com.example.demo.services;

import com.example.demo.dto.product.ProductSave;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return productRepository.findById(id).get();
        } else {
            return null;
        }
    }

    public ResponseEntity<String> deleteProduct(Integer id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            productRepository.deleteById(id);
            return new ResponseEntity<>("Product deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Something happened", HttpStatus.CONFLICT);
        }
    }

    public Product createProduct(ProductSave productSave) {
        Product product = new Product();
        product.setName(productSave.getName());
        product.setDescription(productSave.getDescription());
        product.setPrice(productSave.getPrice());
        product.setImageUrl(productSave.getImageUrl());
        product.setBrand(productSave.getBrand());
        product.setColor(productSave.getColor());
        product.setSize(productSave.getSize());
        product.setProductCondition(productSave.getProductCondition());
        Optional<User> userOptional = userRepository.findById(productSave.getUploaderId());
        if (userOptional.isPresent()) {
            product.setUser(userOptional.get());
        }
        product.setUploadDate(productSave.getUploadDate());
        product.setCategory(productSave.getCategory());
        product.setTargetGender(productSave.getTargetGender());
        product.setStatus(productSave.getStatus());
        return productRepository.save(product);
    }


}

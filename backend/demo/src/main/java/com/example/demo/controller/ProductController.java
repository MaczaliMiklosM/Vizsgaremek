package com.example.demo.controller;

import com.example.demo.enums.Status;
import com.example.demo.model.Product;
import com.example.demo.dto.product.ProductSave;
import com.example.demo.services.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@Tag(name = "Product controller (kész)")
public class ProductController {
    @Autowired
    ProductService productService;

    @PostMapping(value = "/createProduct", consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(@ModelAttribute ProductSave productSave) {
        try {
            Product product = productService.createProduct(productSave);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product could not be created: " + e.getMessage());
        }
    }




    @GetMapping("/getProducts")
    public List<Product> getProducts(){
        return productService.getProducts();
    }

    @GetMapping("/getProductById/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProduct(id);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id){
        return productService.deleteProduct(id);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/approveProduct/{id}")
    public ResponseEntity<String> approveProduct(@PathVariable Integer id) {
        try {
            productService.approveProduct(id); // 👈 kiszervezve a service-be
            return new ResponseEntity<>("Product approved successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<Product> getProductsByUserId(@PathVariable Integer userId) {
        return productService.getProductsByUserId(userId);
    }




}
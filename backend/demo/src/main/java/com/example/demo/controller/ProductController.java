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

    @PostMapping("/createProduct")
    public ResponseEntity<String> createProduct(@RequestBody ProductSave productSave) {
        Product product = productService.createProduct(productSave);
        if (product != null) {
            return new ResponseEntity<>("Product successfully saved", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Something happened", HttpStatus.CONFLICT);
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
        Optional<Product> productOptional = productService.getProductOptional(id);

        if (productOptional.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        Product product = productOptional.get();
        product.setStatus(Status.APPROVED);
        productService.saveProduct(product);

        return new ResponseEntity<>("Product approved successfully", HttpStatus.OK);
    }


}
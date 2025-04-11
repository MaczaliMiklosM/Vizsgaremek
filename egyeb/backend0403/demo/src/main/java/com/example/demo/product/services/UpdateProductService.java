package com.example.demo.product.services;

import com.example.demo.Command;
import com.example.demo.exceptions.ProductNotFoundException;
import com.example.demo.repository.ProductRepository;
import com.example.demo.product.model.Product;
import com.example.demo.dto.ProductDTO;
import com.example.demo.product.model.UpdateProductCommand;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UpdateProductService implements Command<UpdateProductCommand, ProductDTO> {

    private ProductRepository productRepository;

    public UpdateProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @Override
    public ResponseEntity<ProductDTO> execute(UpdateProductCommand command) {
        Optional<Product> productOptional = productRepository.findById(command.getId());
        if (productOptional.isPresent()) {
            Product product = command.getProduct();
            product.setId(command.getId());
        //    ProductValidator.execute(product);
            productRepository.save(product);
            return ResponseEntity.ok(new ProductDTO(product));
        }
        throw new ProductNotFoundException();
    }
}

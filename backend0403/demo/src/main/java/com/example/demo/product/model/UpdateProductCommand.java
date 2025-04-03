package com.example.demo.product.model;

import com.example.demo.Command;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

@Getter
public class UpdateProductCommand {
    private Integer id;
    private Product product;

    public UpdateProductCommand(Integer id, Product product) {
        this.id = id;
        this.product = product;
    }

}


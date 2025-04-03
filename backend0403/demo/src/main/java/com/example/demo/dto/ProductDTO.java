package com.example.demo.dto;

import com.example.demo.product.model.Product;
import lombok.Data;

@Data
public class ProductDTO {
    private Integer id;
    private String name;
    private String description;


    public ProductDTO(Integer id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public ProductDTO(Product product) {
    }
}

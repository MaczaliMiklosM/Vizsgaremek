package com.example.demo.dto;

import com.example.demo.enums.*;
import com.example.demo.product.model.Product;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private Integer id;
    private String name;
    private String description;
    private String imageUrl;
    private Integer stock;
    private String brand;
    private String color;
    private String size;
    private ProductCondition productCondition;
    private Integer uploaderId;
    private LocalDateTime uploadDate;
    private Category category;
    private TargetGender targetGender;
    private Boolean biddingEnabled;
    private BiddingDuration biddingDuration;
    private Status status;


    public ProductDTO(Integer id, String name, String description, String imageUrl, Integer stock, String brand, String color, String size, ProductCondition productCondition, Integer uploaderId, LocalDateTime uploadDate, Category category, TargetGender targetGender, Boolean biddingEnabled, BiddingDuration biddingDuration, Status status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.brand = brand;
        this.color = color;
        this.size = size;
        this.productCondition = productCondition;
        this.uploaderId = uploaderId;
        this.uploadDate = uploadDate;
        this.category = category;
        this.targetGender = targetGender;
        this.biddingEnabled = biddingEnabled;
        this.biddingDuration = biddingDuration;
        this.status = status;
    }

    public ProductDTO(Product product) {
    }
}

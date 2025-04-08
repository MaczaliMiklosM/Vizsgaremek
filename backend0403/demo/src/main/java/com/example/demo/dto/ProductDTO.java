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
    private Double price;
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


    public ProductDTO(Integer id, String name, String description, Double price, String imageUrl, Integer stock, String brand, String color, String size, ProductCondition productCondition, Integer uploaderId, LocalDateTime uploadDate, Category category, TargetGender targetGender, Boolean biddingEnabled, BiddingDuration biddingDuration, Status status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
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
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.stock = product.getStock();
        this.brand = product.getBrand();
        this.color = product.getColor();
        this.size = product.getSize();
        this.productCondition = product.getProductCondition();
        this.uploaderId = product.getUploaderId();
        this.uploadDate = product.getUploadDate();
        this.category = product.getCategory();
        this.targetGender = product.getTargetGender();
        this.biddingEnabled = product.getBiddingEnabled();
        this.biddingDuration = product.getBiddingDuration();
        this.status = product.getStatus();
    }

}

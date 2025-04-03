package com.example.demo.product.model;

import com.example.demo.enums.ProductCondition;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required")
    @Column(name = "name")
    private String name;

    @Size(min = 20, message = "Description too short")
    @Column(name = "description")
    private String description;

    @PositiveOrZero(message = "Price must not be negative")
    @Column(name = "price")
    private Double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "brand")
    private String brand;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;

    @Column(name = "product_condition")
    private ProductCondition productCondition;

    @Column(name = "uploader_id")
    private Integer uploaderId;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "category")
    private String category;

    @Column(name = "target_gender")
    private String targetGender;

    @Column(name = "bidding_enabled")
    private Boolean biddingEnabled;

    @Column(name = "bidding_duration")
    private Integer biddingDuration;

    @Column(name = "status")
    private String status;








}

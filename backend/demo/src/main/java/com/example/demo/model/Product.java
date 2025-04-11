package com.example.demo.model;

import com.example.demo.enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
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

    @Column(name = "brand")
    private String brand;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition", nullable = false)
    private ProductCondition productCondition;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User user;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_gender", nullable = false)
    private TargetGender targetGender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
}

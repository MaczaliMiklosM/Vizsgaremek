package com.example.demo.dto.product;

import com.example.demo.enums.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSave {
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String brand;
    private String color;
    private String size;
    private ProductCondition productCondition;
    private Integer uploaderId;
    private LocalDateTime uploadDate;
    private Category category;
    private TargetGender targetGender;
    private Status status;
}

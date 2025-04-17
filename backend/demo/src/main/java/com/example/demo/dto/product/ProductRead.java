package com.example.demo.dto.product;

import com.example.demo.enums.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRead {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private String brand;
    private String color;
    private String size;
    private ProductCondition productCondition;
    private Category category;
    private TargetGender targetGender;
    private Status status;
    private String imageData;
    private String imageData2;
    private String imageData3;
    private Integer uploaderId;
}

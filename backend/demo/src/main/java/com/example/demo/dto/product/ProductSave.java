package com.example.demo.dto.product;

import com.example.demo.enums.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSave {
    private String name;
    private String description;
    private Double price;
    private MultipartFile imageData; // <-- fontos!
    private String brand;
    private String color;
    private String size;
    private ProductCondition productCondition;
    private Integer uploaderId;
    private Category category;
    private TargetGender targetGender;
    private Status status;
}

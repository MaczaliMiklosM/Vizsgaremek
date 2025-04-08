package com.example.demo.dto;

import com.example.demo.enums.BiddingDuration;
import com.example.demo.enums.Category;
import com.example.demo.enums.ProductCondition;
import com.example.demo.enums.TargetGender;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductUploadForm {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String color;
    private String size;
    private ProductCondition productCondition;
    private Category category;
    private TargetGender targetGender;
    private Boolean biddingEnabled;
    private BiddingDuration biddingDuration;
    private MultipartFile image;
}

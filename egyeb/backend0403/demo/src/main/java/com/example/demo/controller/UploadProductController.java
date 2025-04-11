package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.ProductUploadForm;
import com.example.demo.enums.Status;
import com.example.demo.product.model.Product;
import com.example.demo.product.model.User;
import com.example.demo.product.services.CreateProductService;
import com.example.demo.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class UploadProductController {

    private final CreateProductService createProductService;
    private final UserRepo userRepo;

    @Operation(summary = "Termék feltöltése képpel együtt",
            description = "Bejelentkezett felhasználók tölthetnek fel terméket. A fájl Multipart formában kerül feltöltésre.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sikeres feltöltés"),
            @ApiResponse(responseCode = "403", description = "Nincs jogosultság"),
            @ApiResponse(responseCode = "400", description = "Hibás kérés")
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> uploadProduct(
            @ModelAttribute ProductUploadForm form,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            // Fájl mentése
            String fileName = UUID.randomUUID() + "_" + form.getImage().getOriginalFilename();
            Path path = Paths.get("uploads", fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, form.getImage().getBytes());

            // Bejelentkezett felhasználó
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Termék létrehozása
            Product product = new Product();
            product.setName(form.getName());
            product.setDescription(form.getDescription());
            product.setPrice(form.getPrice());
            product.setStock(form.getStock());
            product.setBrand(form.getBrand());
            product.setColor(form.getColor());
            product.setSize(form.getSize());
            product.setProductCondition(form.getProductCondition());
            product.setCategory(form.getCategory());
            product.setTargetGender(form.getTargetGender());
            product.setBiddingEnabled(form.getBiddingEnabled());
            product.setBiddingDuration(form.getBiddingDuration());
            product.setUploadDate(LocalDateTime.now());
            product.setUploaderId(user.getUser_id());
            product.setStatus(Status.UNAPPROVED);
            product.setImageUrl("/uploads/" + fileName);

            return createProductService.execute(product);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

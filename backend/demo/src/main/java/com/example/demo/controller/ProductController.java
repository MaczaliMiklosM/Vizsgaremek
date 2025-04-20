package com.example.demo.controller;

import com.example.demo.dto.product.ProductRead;
import com.example.demo.model.Product;
import com.example.demo.dto.product.ProductSave;
import com.example.demo.services.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/products")
@Tag(name = "Product controller")
public class ProductController {

    @Autowired
    ProductService productService;

    /**
     * Új termék létrehozása multipart/form-data formátumban
     *
     * @param productSave a feltöltött termék adatokat tartalmazó DTO
     * @return válasz, hogy sikeres volt-e a mentés
     */
    @PostMapping(value = "/createProduct", consumes = "multipart/form-data")
    public ResponseEntity<String> createProduct(@ModelAttribute ProductSave productSave) {
        Product product = productService.createProduct(productSave);
        if (product != null) {
            return new ResponseEntity<>("Product successfully saved", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Something happened", HttpStatus.CONFLICT);
        }
    }

    /**
     * Összes termék lekérdezése (minden státusz)
     *
     * @return terméklista
     */
    @GetMapping("/getProducts")
    public List<Product> getProducts(){
        return productService.getProducts();
    }

    /**
     * Egy konkrét termék lekérdezése ID alapján (base64-es képekkel)
     *
     * @param id a keresett termék azonosítója
     * @return a termék DTO-ja vagy 404 ha nem található
     */
    @GetMapping("/getProductById/{id}")
    public ResponseEntity<ProductRead> getProductById(@PathVariable Integer id) {
        Product product = productService.getProduct(id);
        if (product == null) return ResponseEntity.notFound().build();

        ProductRead dto = new ProductRead(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getBrand(),
                product.getColor(),
                product.getSize(),
                product.getProductCondition(),
                product.getCategory(),
                product.getTargetGender(),
                product.getStatus(),
                product.getImageData() != null ? Base64.getEncoder().encodeToString(product.getImageData()) : null,
                product.getImageData2() != null ? Base64.getEncoder().encodeToString(product.getImageData2()) : null,
                product.getImageData3() != null ? Base64.getEncoder().encodeToString(product.getImageData3()) : null,
                product.getUser() != null ? product.getUser().getId() : null
        );

        return ResponseEntity.ok(dto);
    }

    /**
     * Egy termék törlése (csak admin jogosultsággal)
     *
     * @param id a törlendő termék azonosítója
     * @return válaszüzenet a törlés eredményéről
     */
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id){
        return productService.deleteProduct(id);
    }

    /**
     * Termék jóváhagyása (csak admin joggal)
     *
     * @param id a jóváhagyandó termék azonosítója
     * @return sikeres vagy hiba válasz
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/approveProduct/{id}")
    public ResponseEntity<String> approveProduct(@PathVariable Integer id) {
        try {
            productService.approveProduct(id); // 👈 kiszervezve a service-be
            return new ResponseEntity<>("Product approved successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Egy adott felhasználó által feltöltött termékek lekérdezése
     *
     * @param userId a feltöltő felhasználó azonosítója
     * @return terméklista
     */
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<Product> getProductsByUserId(@PathVariable Integer userId) {
        return productService.getProductsByUserId(userId);
    }

}

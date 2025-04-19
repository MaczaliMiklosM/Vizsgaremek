package com.example.demo.controller;

import com.example.demo.dto.collection.CollectionRead;
import com.example.demo.model.Collection;
import com.example.demo.model.Product;
import com.example.demo.services.CollectionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/collection")
@Tag(name = "Collection controller")
public class CollectionController {

    @Autowired
    CollectionService collectionService;

    /**
     * Lekérdezi az adott felhasználó gyűjteményét.
     * A visszatérő lista tartalmazza a termék nevét, árát és base64-ben kódolt képeit is.
     *
     * @param userId a felhasználó azonosítója
     * @return a felhasználó kollekciójában szereplő termékek listája
     */
    @GetMapping("/{userId}")
    public List<CollectionRead> getUserCollection(@PathVariable Integer userId) {
        List<Collection> collections = collectionService.getUserCollection(userId);
        List<CollectionRead> response = new ArrayList<>();

        for (Collection item : collections) {
            Product product = item.getProduct();
            response.add(new CollectionRead(
                    item.getId(),
                    item.getUser().getId(),
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getImageData() != null ? Base64.getEncoder().encodeToString(product.getImageData()) : null,
                    product.getImageData2() != null ? Base64.getEncoder().encodeToString(product.getImageData2()) : null,
                    product.getImageData3() != null ? Base64.getEncoder().encodeToString(product.getImageData3()) : null
            ));
        }
        return response;
    }
}

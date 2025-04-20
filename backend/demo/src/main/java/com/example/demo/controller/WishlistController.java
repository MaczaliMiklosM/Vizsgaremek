package com.example.demo.controller;

import com.example.demo.dto.wishlist.WishlistDelete;
import com.example.demo.dto.wishlist.WishlistRead;
import com.example.demo.dto.wishlist.WishlistSave;
import com.example.demo.model.Product;
import com.example.demo.model.Wishlist;
import com.example.demo.services.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/wishlist")
@Tag(name = "Wishlist controller")
public class WishlistController {

    @Autowired
    WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    /**
     * Egy adott felhasználó kívánságlistájának lekérdezése.
     *
     * @param userId a felhasználó azonosítója
     * @return a felhasználó kívánságlistájának termékei (képekkel, státusszal együtt)
     */
    @GetMapping("/{userId}")
    public List<WishlistRead> getWishlistById(@PathVariable Integer userId) {
        List<Wishlist> wishlistItems = wishlistService.getWishlistById(userId);
        List<WishlistRead> response = new ArrayList<>();

        for (Wishlist item : wishlistItems) {
            Product product = item.getProduct();

            response.add(new WishlistRead(
                    item.getId(),
                    item.getUser().getId(),
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getImageData() != null ? Base64.getEncoder().encodeToString(product.getImageData()) : null,
                    product.getImageData2() != null ? Base64.getEncoder().encodeToString(product.getImageData2()) : null,
                    product.getImageData3() != null ? Base64.getEncoder().encodeToString(product.getImageData3()) : null,
                    product.getStatus().toString()
            ));
        }

        return response;
    }

    /**
     * Új termék hozzáadása a kívánságlistához.
     *
     * @param wishlistSave a felhasználó és termék ID-ját tartalmazó objektum
     * @return a mentett wishlist tétel DTO formában
     */
    @PostMapping("/addWishlistItem")
    public WishlistRead addToWishlist(@RequestBody WishlistSave wishlistSave) {
        Wishlist wishlist = wishlistService.addToWishlist(wishlistSave);

        WishlistRead wishlistRead = new WishlistRead();
        wishlistRead.setId(wishlist.getId());
        wishlistRead.setUserId(wishlist.getUser().getId());
        wishlistRead.setProductId(wishlist.getProduct().getId());

        return wishlistRead;
    }

    /**
     * Egy adott termék eltávolítása a felhasználó kívánságlistájáról.
     *
     * @param wishlistDelete felhasználó és termék ID-t tartalmazó objektum
     * @return sikeres vagy sikertelen művelet státuszüzenete
     */
    @DeleteMapping("/removeWishlistItem")
    public ResponseEntity<String> removeFromWishlist(@RequestBody WishlistDelete wishlistDelete) {
        return wishlistService.removeFromWishlist(wishlistDelete);
    }
}

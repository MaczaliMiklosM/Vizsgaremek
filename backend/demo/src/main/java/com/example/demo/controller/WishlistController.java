/*
package com.example.demo.controller;


import com.example.demo.dto.wishlist.WishlistDelete;
import com.example.demo.dto.wishlist.WishlistRead;
import com.example.demo.dto.wishlist.WishlistSave;
import com.example.demo.model.Wishlist;
import com.example.demo.services.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/wishlist")
@Tag(name = "Wishlist controller (kész)")
public class WishlistController {
    @Autowired
    WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public List<WishlistRead> getWishlistById(@PathVariable Integer userId) {
        List<Wishlist> wishlistItems = wishlistService.getWishlistById(userId);
        List<WishlistRead> wishlistReadItems = new ArrayList<>();
        for (Wishlist wishlistItem : wishlistItems) {
            wishlistReadItems.add(
                    new WishlistRead(
                            wishlistItem.getId(),
                            wishlistItem.getUser().getId(),
                            wishlistItem.getProduct().getId()
                    )
            );
        }
        return wishlistReadItems;
    }

    @PostMapping("/addWishlistItem")
    public WishlistRead addToWishlist(@RequestBody WishlistSave wishlistSave) {
        Wishlist wishlist = wishlistService.addToWishlist(wishlistSave);
        WishlistRead wishlistRead = new WishlistRead();
        wishlistRead.setId(wishlist.getId());
        wishlistRead.setUserId(wishlist.getUser().getId());
        wishlistRead.setProductId(wishlist.getProduct().getId());
        return wishlistRead;
    }

    @DeleteMapping("/removeWishlistItem")
    public ResponseEntity<String> removeFromWishlist(@RequestBody WishlistDelete wishlistDelete) {
        return wishlistService.removeFromWishlist(wishlistDelete);
    }
}



 */


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
@Tag(name = "Wishlist controller (kész)")
public class WishlistController {
    @Autowired
    WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

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
                    product.getImageData3() != null ? Base64.getEncoder().encodeToString(product.getImageData3()) : null
            ));
        }
        return response;
    }


    @PostMapping("/addWishlistItem")
    public WishlistRead addToWishlist(@RequestBody WishlistSave wishlistSave) {
        Wishlist wishlist = wishlistService.addToWishlist(wishlistSave);
        WishlistRead wishlistRead = new WishlistRead();
        wishlistRead.setId(wishlist.getId());
        wishlistRead.setUserId(wishlist.getUser().getId());
        wishlistRead.setProductId(wishlist.getProduct().getId());
        return wishlistRead;
    }

    @DeleteMapping("/removeWishlistItem")
    public ResponseEntity<String> removeFromWishlist(@RequestBody WishlistDelete wishlistDelete) {
        return wishlistService.removeFromWishlist(wishlistDelete);
    }
}



package com.example.demo.services;

import com.example.demo.dto.product.ProductSave;
import com.example.demo.enums.Status;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.model.Wishlist;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    WishlistRepository wishlistRepository;

    /**
     * Visszaadja az összes terméket.
     *
     * @return terméklista
     */
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    /**
     * Visszaad egy konkrét terméket ID alapján.
     *
     * @param id a termék azonosítója
     * @return a keresett termék vagy null
     */
    public Product getProduct(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    /**
     * Töröl egy terméket adminisztrátori jogosultsággal.
     * A feltöltő és a kívánságlistán szereplő felhasználók értesítést kapnak.
     *
     * @param id a törlendő termék ID-ja
     * @return HTTP válasz státusz
     */
    public ResponseEntity<String> deleteProduct(Integer id) {
        Optional<Product> productOptional = productRepository.findById(id);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            User uploader = product.getUser();

            // Értesítés a feltöltőnek
            if (uploader != null) {
                notificationService.sendNotification(
                        uploader,
                        "Your product \"" + product.getName() + "\" has been deleted by an admin."
                );
            }

            // Értesítés a kívánságlistás felhasználóknak
            List<Wishlist> wishlists = wishlistRepository.findByProductId(product.getId());
            for (Wishlist w : wishlists) {
                User u = w.getUser();
                if (u.getId() != uploader.getId()) {
                    notificationService.sendNotification(
                            u,
                            "A product on your wishlist has been removed: \"" + product.getName() + "\""
                    );
                }
            }

            wishlistRepository.deleteAll(wishlists);
            productRepository.deleteById(id);
            return new ResponseEntity<>("Product deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.CONFLICT);
        }
    }

    /**
     * Új termék létrehozása és adatbázisba mentése.
     * A feltöltő értesítést kap, és a termék státusza UNAPPROVED lesz.
     *
     * @param productSave a beküldött termékadatokat tartalmazó DTO
     * @return a mentett termék vagy null
     */
    public Product createProduct(ProductSave productSave) {
        Product product = new Product();
        product.setName(productSave.getName());
        product.setDescription(productSave.getDescription());
        product.setPrice(productSave.getPrice());
        product.setBrand(productSave.getBrand());
        product.setColor(productSave.getColor());
        product.setSize(productSave.getSize());
        product.setProductCondition(productSave.getProductCondition());
        product.setUploadDate(LocalDateTime.now());
        product.setCategory(productSave.getCategory());
        product.setTargetGender(productSave.getTargetGender());
        product.setStatus(Status.UNAPPROVED);

        Optional<User> userOptional = userRepository.findById(productSave.getUploaderId());
        if (userOptional.isPresent()) {
            User uploader = userOptional.get();
            product.setUser(uploader);

            try {
                if (productSave.getImageData() != null && !productSave.getImageData().isEmpty()) {
                    product.setImageData(productSave.getImageData().getBytes());
                }
                if (productSave.getImageData2() != null && !productSave.getImageData2().isEmpty()) {
                    product.setImageData2(productSave.getImageData2().getBytes());
                }
                if (productSave.getImageData3() != null && !productSave.getImageData3().isEmpty()) {
                    product.setImageData3(productSave.getImageData3().getBytes());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            Product savedProduct = productRepository.save(product);

            // Értesítés a feltöltőnek
            notificationService.sendNotification(
                    uploader,
                    "Upload successful! Your product \"" + savedProduct.getName() + "\" is now awaiting admin approval."
            );

            return savedProduct;
        }
        return null;
    }

    /**
     * Lekéri a terméket Optional formában.
     *
     * @param id termék ID
     * @return Optional<Product>
     */
    public Optional<Product> getProductOptional(Integer id) {
        return productRepository.findById(id);
    }

    /**
     * Elment egy meglévő terméket (pl. frissítéshez).
     *
     * @param product mentendő termék
     * @return mentett termék
     */
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Visszaadja a felhasználó által feltöltött termékeket.
     *
     * @param userId feltöltő ID-ja
     * @return terméklista
     */
    public List<Product> getProductsByUserId(Integer userId) {
        return productRepository.findByUser_Id(userId);
    }

    /**
     * Admin által jóváhagyott termék státuszát frissíti és értesítést küld.
     *
     * @param productId jóváhagyandó termék ID
     */
    public void approveProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(Status.APPROVED);
        productRepository.save(product);

        // Értesítés a feltöltőnek
        User uploader = product.getUser();
        notificationService.sendNotification(
                uploader,
                "Your product \"" + product.getName() + "\" has been approved and is now visible on the site!"
        );
    }
}

package com.example.demo.product.services;

import com.example.demo.product.model.Bid;
import com.example.demo.product.model.Product;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {
    private final BidRepository bidRepository;
    private final ProductRepository productRepository;

    public BidService(BidRepository bidRepository, ProductRepository productRepository) {
        this.bidRepository = bidRepository;
        this.productRepository = productRepository;
    }


    public List<Bid> getBidsByProduct(Integer productId) {
        return bidRepository.findByProductId(productId);
    }

    public List<Bid> getBidsByUser(Integer userId) {
        return bidRepository.findByUserId(userId);
    }

    public List<Bid> getBidsByUserAndProduct(Integer userId, Integer productId) {
        return bidRepository.findByUserIdAndProductId(userId, productId);
    }

    public Bid placeBid(Bid bid) {
        Product product = productRepository.findById(bid.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (Boolean.FALSE.equals(product.getBiddingEnabled())) {
            throw new IllegalStateException("Bidding is not enabled for this product.");
        }


        // Ellenőrzés: lejárt-e a licitálási idő
        if (product.getBiddingStartTime() != null && product.getBiddingDuration() != null) {
            LocalDateTime endTime = product.getBiddingStartTime()
                    .plusHours(product.getBiddingDuration().getHours());

            if (LocalDateTime.now().isAfter(endTime)) {
                throw new IllegalStateException("Bidding period has expired for this product.");
            }
        }

        return bidRepository.save(bid);
    }


    public void deleteBid(Integer bidId) {
        bidRepository.deleteById(bidId);
    }
}


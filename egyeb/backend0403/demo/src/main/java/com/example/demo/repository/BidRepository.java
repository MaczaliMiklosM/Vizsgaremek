package com.example.demo.repository;

import com.example.demo.product.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    List<Bid> findByProductId(Integer productId);
    List<Bid> findByUserId(Integer userId);
    List<Bid> findByUserIdAndProductId(Integer userId, Integer productId);
}


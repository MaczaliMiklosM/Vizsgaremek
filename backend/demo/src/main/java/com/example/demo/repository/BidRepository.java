package com.example.demo.repository;

import com.example.demo.model.Bid;
import com.example.demo.enums.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    List<Bid> findByProductId(Integer productId);
    List<Bid> findByProduct_User_Id(Integer userId);

    List<Bid> findByBidderId(Integer userId);
    boolean existsByProductIdAndBidderIdAndStatus(Integer productId, Integer bidderId, BidStatus status);
}

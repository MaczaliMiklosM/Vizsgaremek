package com.example.demo.product.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "bid_amount", nullable = false)
    private Integer bidAmount;

    @Column(name = "bid_time", nullable = false)
    private LocalDateTime bidTime;

    @PrePersist
    public void prePersist() {
        bidTime = LocalDateTime.now();
    }
}



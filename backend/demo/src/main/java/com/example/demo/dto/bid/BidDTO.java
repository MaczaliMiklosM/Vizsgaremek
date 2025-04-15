package com.example.demo.dto.bid;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BidDTO {

    private Integer id;
    private Double amount;
    private LocalDateTime time;
    private String status; // Bid status: "PENDING", "ACCEPTED", "REJECTED"
    private Integer productId; // Product ID (nem a teljes termék)
    private Integer userId; // User ID (nem a teljes felhasználó)
    private String productName;
    private String userName;

    // Konstruktor
    public BidDTO(Integer id, Double amount, LocalDateTime time, String status, Integer productId, Integer userId, String productName, String userName) {
        this.id = id;
        this.amount = amount;
        this.time = time;
        this.status = status;
        this.productId = productId;
        this.userId = userId;
        this.productName = productName;
        this.userName = userName;
    }

    // Overloaded constructor for backward compatibility
    public BidDTO(Integer id, Double amount, LocalDateTime time, String status, Integer productId, Integer userId) {
        this(id, amount, time, status, productId, userId, null, null);
    }
}

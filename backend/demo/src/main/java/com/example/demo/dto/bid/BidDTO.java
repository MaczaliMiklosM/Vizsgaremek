package com.example.demo.dto.bid;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BidDTO {
    private Integer id;
    private Double amount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime time;

    private String status;
    private Integer productId;
    private Integer userId;
    private String productName;
    private String userName;

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

    public BidDTO(Integer id, Double amount, LocalDateTime time, String status, Integer productId, Integer userId) {
        this(id, amount, time, status, productId, userId, null, null);
    }
}

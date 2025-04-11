package com.example.demo.model;


import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "order_header")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderHeader {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderBody> items;
}

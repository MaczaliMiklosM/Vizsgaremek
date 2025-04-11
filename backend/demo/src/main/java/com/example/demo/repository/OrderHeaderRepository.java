package com.example.demo.repository;

import com.example.demo.enums.OrderStatus;
import com.example.demo.model.OrderHeader;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderHeaderRepository extends JpaRepository<OrderHeader, Integer> {
    // Új lekérdezés a felhasználó és a státusz alapján
    Optional<OrderHeader> findByUserAndStatus(User user, OrderStatus status);
}
package com.example.demo.repository;

import com.example.demo.product.model.OrderHeader;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderHeaderRepository extends JpaRepository<OrderHeader, Integer> {
}
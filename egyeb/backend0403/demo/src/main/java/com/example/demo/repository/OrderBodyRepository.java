package com.example.demo.repository;

import com.example.demo.product.model.OrderBody;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderBodyRepository extends JpaRepository<OrderBody, Long> {
}

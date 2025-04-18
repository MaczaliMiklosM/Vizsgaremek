package com.example.demo.repository;

import com.example.demo.model.OrderBody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderBodyRepository extends JpaRepository<OrderBody, Long> {

    Optional<OrderBody> findByOrder_User_IdAndProductId(Integer userId, Integer productId);
}

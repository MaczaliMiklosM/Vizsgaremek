package com.luxcollect.repository;

import com.luxcollect.model.Order;
import com.luxcollect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}

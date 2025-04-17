package com.example.demo.enums;


public enum OrderStatus {
    PROCESSING,         // kosárban van, még nem rendelték meg
    CART,   // leadott rendelés, de még nem postázták
    SHIPPED,      // postázva
    DELIVERED,    // kézbesítve
    CANCELLED     // törölt rendelés
}

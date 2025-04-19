package com.example.demo.services;

import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;

import java.util.List;

/**
 * Szolgáltatási interfész a rendelések kezeléséhez.
 * Tartalmazza az összes olyan műveletet, amit a rendelések létrehozásához,
 * lekérdezéséhez és a kosárhoz adáshoz használunk.
 */
public interface OrderService {

    /**
     * Új rendelés létrehozása a megadott adatok alapján.
     *
     * @param request az új rendelés létrehozásához szükséges adatok
     * @return a létrehozott rendelés részleteit tartalmazó objektum
     */
    OrderResponseDTO createOrder(OrderRequestDTO request);

    /**
     * Egy rendelés lekérdezése azonosító alapján.
     *
     * @param orderId a keresett rendelés azonosítója
     * @return a megtalált rendelés részletei
     */
    OrderResponseDTO getOrderById(Integer orderId);

    /**
     * Egy adott felhasználóhoz tartozó összes rendelés lekérdezése.
     *
     * @param userId a felhasználó azonosítója
     * @return a felhasználó rendeléseinek listája
     */
    List<OrderResponseDTO> getOrdersByUserId(Integer userId);

    /**
     * Összes rendelés lekérdezése (admin célokra).
     *
     * @return minden rendelés listája a rendszerből
     */
    List<OrderResponseDTO> getAllOrders();

    /**
     * Egy termék kosárhoz adása a megadott felhasználónál.
     *
     * @param userId a felhasználó azonosítója
     * @param productId a termék azonosítója
     */
    void addToCart(Integer userId, Integer productId);
}

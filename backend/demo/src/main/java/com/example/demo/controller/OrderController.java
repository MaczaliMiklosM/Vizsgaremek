package com.example.demo.controller;

import com.example.demo.dto.order.AddToCartRequestDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.services.NotificationService;
import com.example.demo.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.OrderHeader;
import com.example.demo.repository.OrderHeaderRepository;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final NotificationService notificationService;
    private final OrderService orderService;

    /**
     * Új rendelés létrehozása a megadott adatok alapján.
     * A mennyiség mindig 1, és a rendelés automatikusan "PLACED" státuszba kerül.
     *
     * @param request a rendelés részleteit tartalmazó DTO
     * @return a létrehozott rendelés adatai
     */
    @PostMapping("/createOrder")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    /**
     * Rendelés lekérdezése rendelés ID alapján.
     *
     * @param id a rendelés azonosítója
     * @return a megtalált rendelés adatai
     */
    @GetMapping("/getOrderById/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Termék hozzáadása a felhasználó aktív (CART státuszú) kosarához.
     * Ha nincs még ilyen rendelése, akkor létrehozzuk.
     *
     * @param request a felhasználó és a termék ID-ját tartalmazó DTO
     * @return üres válasz (200 OK)
     */
    @PostMapping("/addToCart")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequestDTO request) {
        orderService.addToCart(request.getUserId(), request.getProductId());
        return ResponseEntity.ok().build();
    }

    /**
     * Egy felhasználó összes rendelésének lekérdezése ID alapján.
     *
     * @param user_id a felhasználó azonosítója
     * @return a rendelései listája DTO formátumban
     */
    @GetMapping("/getAllOrdersById/{user_id}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Integer user_id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(user_id));
    }

    /**
     * Az összes rendelés lekérdezése az adatbázisból.
     * Csak admin jogosultsággal elérhető!
     *
     * @return az összes rendelés listája DTO formátumban
     */
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @Autowired
    private OrderHeaderRepository orderHeaderRepository;

    /**
     * Admin által meghívható végpont egy rendelés státuszának frissítésére.
     * Ha a státusz sikeresen frissül, automatikusan értesítést küld a felhasználónak.
     *
     * @param orderId a rendelés azonosítója
     * @param status az új státusz (pl. PROCESSING, SHIPPED, stb.)
     * @return szöveges visszajelzés a frissítés eredményéről
     */
    @PutMapping("/admin/updateStatus/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam("status") String status) {

        OrderHeader order = orderHeaderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderHeaderRepository.save(order);
            notificationService.sendNotification(
                    order.getUser(),
                    "Your order #" + order.getOrderId() + " status was updated to: " + newStatus.name()
            );

            return ResponseEntity.ok("Order status updated to " + newStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + status);
        }
    }
}

package com.example.demo.services;

import com.example.demo.dto.order.OrderItemDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.OrderBody;
import com.example.demo.model.OrderHeader;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderBodyRepository;
import com.example.demo.repository.OrderHeaderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderHeaderRepository orderHeaderRepository;
    private final OrderBodyRepository orderBodyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Existing method to create an order
    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderBody> orderItems = new ArrayList<>();
        int totalAmount = 0;

        // OrderHeader létrehozása és mentése
        OrderHeader order = OrderHeader.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PLACED)
                .totalAmount(0) // Kezdeti összeg 0
                .build();

        order = orderHeaderRepository.save(order);

        // Termékek hozzáadása az rendeléshez
        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));  // Ha a termék nem található, kivétel dobása

            totalAmount += itemDTO.getQuantity() * itemDTO.getUnitPrice();

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDTO.getQuantity())  // Mivel mindig 1, ezt itt is biztosítjuk
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();

            orderItems.add(orderBody);
        }

        // Összeg beállítása a rendeléshez
        order.setTotalAmount(totalAmount);

        // Rendelés tételek mentése
        order.setItems(orderBodyRepository.saveAll(orderItems));

        // Végleges rendelés mentése
        orderHeaderRepository.save(order);

        return new OrderResponseDTO(
                order.getOrderId(),
                user.getId(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getTotalAmount(),
                request.getItems()
        );
    }



    // New method for adding products to the cart
    public void addToCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kosár keresése a felhasználóhoz
        OrderHeader order = orderHeaderRepository.findByUserAndStatus(user, OrderStatus.CART)
                .orElse(null);  // Ha nem található, null értéket adunk vissza

        if (order == null) {
            // Ha nincs kosár, új rendelés létrehozása
            order = OrderHeader.builder()
                    .user(user)
                    .status(OrderStatus.CART)
                    .build();
            order = orderHeaderRepository.save(order);
        }

        // Ellenőrizni, hogy a termék már benne van-e a kosárban
        Optional<OrderBody> existingOrderBody = orderBodyRepository.findByOrder_User_IdAndProductId(userId, productId);
        if (existingOrderBody.isPresent()) {
            // Ha már benne van a termék, ne növeljük a quantity-t (mivel mindig 1)
            return;
        } else {
            // Új termék hozzáadása a kosárhoz
            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(1)  // Always 1 as quantity is fixed
                    .unitPrice(product.getPrice().intValue())
                    .build();
            orderBodyRepository.save(orderBody);
        }
    }



    @Override
    public OrderResponseDTO getOrderById(Integer orderId) {
        OrderHeader order = orderHeaderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        for (OrderBody body : order.getItems()) {
            itemDTOs.add(new OrderItemDTO(
                    body.getProduct().getId(),
                    body.getUnitPrice(),
                    1 // quantity is always 1
            ));
        }

        return new OrderResponseDTO(
                order.getOrderId(),
                order.getUser().getId(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getTotalAmount(),
                itemDTOs
        );
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserId(Integer userId) {
        List<OrderHeader> orders = orderHeaderRepository.findAll();
        List<OrderResponseDTO> result = new ArrayList<>();

        for (OrderHeader order : orders) {
            if (order.getUser().getId() == userId) {
                result.add(getOrderById(order.getOrderId()));
            }
        }
        return result;
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<OrderHeader> orders = orderHeaderRepository.findAll();
        List<OrderResponseDTO> result = new ArrayList<>();

        for (OrderHeader order : orders) {
            result.add(getOrderById(order.getOrderId()));
        }
        return result;
    }
}

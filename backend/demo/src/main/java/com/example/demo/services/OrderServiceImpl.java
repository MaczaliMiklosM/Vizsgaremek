/*
package com.example.demo.services;

import com.example.demo.dto.order.OrderItemDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.*;
import com.example.demo.repository.OrderBodyRepository;
import com.example.demo.repository.OrderHeaderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final NotificationService notificationService;
    private final CollectionService collectionService;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderBody> orderItems = new ArrayList<>();
        int totalAmount = 0;

        OrderHeader order = OrderHeader.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PLACED)
                .totalAmount(0)
                .build();

        order = orderHeaderRepository.save(order);

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            totalAmount += itemDTO.getQuantity() * itemDTO.getUnitPrice();

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();

            orderItems.add(orderBody);

            // Add to collection and mark as SOLD
            Collection collectionItem = Collection.builder()
                    .user(user)
                    .product(product)
                    .build();
            collectionService.saveToCollection(collectionItem);

            product.setStatus(Status.SOLD);
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderBodyRepository.saveAll(orderItems));
        orderHeaderRepository.save(order);

        notificationService.sendNotification(user, "Successful purchase! Order ID: " + order.getOrderId());

        return new OrderResponseDTO(
                order.getOrderId(),
                user.getId(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getTotalAmount(),
                request.getItems()
        );
    }

    public void addToCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        OrderHeader order = orderHeaderRepository.findByUserAndStatus(user, OrderStatus.CART)
                .orElse(null);

        if (order == null) {
            order = OrderHeader.builder()
                    .user(user)
                    .status(OrderStatus.CART)
                    .build();
            order = orderHeaderRepository.save(order);
        }

        Optional<OrderBody> existingOrderBody = orderBodyRepository.findByOrder_User_IdAndProductId(userId, productId);
        if (existingOrderBody.isPresent()) {
            return;
        } else {
            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(1)
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
                    1
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
 */

package com.example.demo.services;

import com.example.demo.dto.order.OrderItemDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.*;
import com.example.demo.repository.OrderBodyRepository;
import com.example.demo.repository.OrderHeaderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final WishlistRepository wishlistRepository;
    private final NotificationService notificationService;
    private final CollectionService collectionService;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderBody> orderItems = new ArrayList<>();
        int totalAmount = 0;

        StringBuilder productNames = new StringBuilder(); // 👈

        OrderHeader order = OrderHeader.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PLACED)
                .totalAmount(0)
                .build();

        order = orderHeaderRepository.save(order);

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            totalAmount += itemDTO.getQuantity() * itemDTO.getUnitPrice();

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();

            orderItems.add(orderBody);

            productNames.append(product.getName()).append(", "); // 👈 gyűjtjük a neveket

            // ✅ Add to collection and mark as SOLD
            Collection collectionItem = Collection.builder()
                    .user(user)
                    .product(product)
                    .build();
            collectionService.saveToCollection(collectionItem);

            product.setStatus(Status.SOLD);
            productRepository.save(product);

            // ✅ Notify other users with this product in their wishlist
            List<Wishlist> allWishlists = wishlistRepository.findAll();
            for (Wishlist w : allWishlists) {
                if (w.getProduct().getId().equals(product.getId())
                        && w.getUser().getId() != user.getId()) {
                    notificationService.sendNotification(
                            w.getUser(),
                            "The item on your wishlist has been sold. Name: " + product.getName()
                    );
                }
            }

            // ✅ Remove product from all wishlists (after notifications)
            wishlistRepository.deleteByProductId(product.getId());
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderBodyRepository.saveAll(orderItems));
        orderHeaderRepository.save(order);

        // ✅ Send success notification to buyer with all product names
        notificationService.sendNotification(
                user,
                "Successful purchase! Order ID: " + order.getOrderId() +
                        " | Products: " + productNames.toString().replaceAll(", $", "")
        );

        return new OrderResponseDTO(
                order.getOrderId(),
                user.getId(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getTotalAmount(),
                request.getItems()
        );
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
                    1
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

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

        StringBuilder productNames = new StringBuilder();

        // 🧹 TÖRLÉS minden korábbi CART státuszú rendelésből (biztos ami biztos)
        List<OrderHeader> carts = orderHeaderRepository.findAllByUserAndStatus(user, OrderStatus.CART);
        for (OrderHeader cart : carts) {
            orderBodyRepository.deleteAll(cart.getItems());
            orderHeaderRepository.delete(cart);
        }

        // 📦 Új rendelés
        OrderHeader order = OrderHeader.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PROCESSING)
                .totalAmount(0)
                .build();
        order = orderHeaderRepository.save(order);

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            totalAmount += itemDTO.getUnitPrice();

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();
            orderItems.add(orderBody);

            productNames.append(product.getName()).append(", ");

            // ✅ Add to collection + mark SOLD
            Collection collectionItem = Collection.builder()
                    .user(user)
                    .product(product)
                    .build();
            collectionService.saveToCollection(collectionItem);

            product.setStatus(Status.SOLD);
            productRepository.save(product);

            // ✅ Notify others
            // ✅ Notify others
            List<Wishlist> allWishlists = wishlistRepository.findAll();
            for (Wishlist w : allWishlists) {
                if (w.getProduct().getId().equals(product.getId()) && w.getUser().getId() != user.getId()) {
                    notificationService.sendNotification(
                            w.getUser(),
                            "The item on your wishlist has been sold. Name: " + product.getName()
                    );
                }
            }

            wishlistRepository.deleteByProductId(product.getId());
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderBodyRepository.saveAll(orderItems));
        orderHeaderRepository.save(order);

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
    public void addToCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // check if user already has a cart
        OrderHeader order = orderHeaderRepository.findByUserAndStatus(user, OrderStatus.CART)
                .orElse(null);

        if (order == null) {
            order = OrderHeader.builder()
                    .user(user)
                    .status(OrderStatus.CART)
                    .totalAmount(0)
                    .build();
            order = orderHeaderRepository.save(order);
        }

        // avoid duplicates
        Optional<OrderBody> existing = orderBodyRepository.findByOrder_User_IdAndProductId(userId, productId);
        if (existing.isPresent()) return;

        OrderBody body = OrderBody.builder()
                .order(order)
                .product(product)
                .quantity(1)
                .unitPrice(product.getPrice().intValue())
                .build();

        orderBodyRepository.save(body);

        // ✅ update totalAmount for cart
        Integer orderId = order.getOrderId(); // ez már "final" lesz a lambda számára

        int updatedTotal = orderBodyRepository.findAll().stream()
                .filter(ob -> ob.getOrder().getOrderId().equals(orderId))
                .mapToInt(OrderBody::getUnitPrice)
                .sum();


        order.setTotalAmount(updatedTotal);
        orderHeaderRepository.save(order);
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
                    1,
                    body.getProduct().getName() // ✅ productName
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

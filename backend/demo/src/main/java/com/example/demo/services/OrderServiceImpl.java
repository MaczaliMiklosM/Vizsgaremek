package com.example.demo.services;

import com.example.demo.dto.order.OrderItemDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.BidStatus;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final BidRepository bidRepository;
    private final OrderHeaderRepository orderHeaderRepository;
    private final OrderBodyRepository orderBodyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;
    private final NotificationService notificationService;
    private final CollectionService collectionService;

    /**
     * Létrehoz egy új rendelést a megadott termékekkel és felhasználóval.
     *
     * @param request a rendelési adatok DTO formában
     * @return a létrehozott rendelés válasz DTO-ja
     */

    @Transactional
    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderBody> orderItems = new ArrayList<>();
        int totalAmount = 0;
        StringBuilder productNames = new StringBuilder();

        List<OrderHeader> carts = orderHeaderRepository.findAllByUserAndStatus(user, OrderStatus.CART);
        for (OrderHeader cart : carts) {
            List<OrderBody> validItems = cart.getItems().stream()
                    .filter(body -> body.getProduct().getStatus() != Status.SOLD)
                    .collect(Collectors.toList());

            cart.setItems(validItems);
            orderBodyRepository.deleteAll(cart.getItems());
            orderHeaderRepository.save(cart);
        }

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

            if (product.getStatus() == Status.SOLD) {
                throw new RuntimeException("The product " + product.getName() + " is already sold and cannot be purchased.");
            }

            totalAmount += itemDTO.getUnitPrice();

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();
            orderItems.add(orderBody);

            productNames.append(product.getName()).append(", ");

            Collection collectionItem = Collection.builder()
                    .user(user)
                    .product(product)
                    .build();
            collectionService.saveToCollection(collectionItem);

            product.setStatus(Status.SOLD);
            productRepository.save(product);

            // Összes többi licit REJECTED lesz
            List<Bid> allBids = bidRepository.findByProductId(product.getId());
            for (Bid bid : allBids) {
                if (bid.getStatus() == BidStatus.PENDING) {
                    bid.setStatus(BidStatus.REJECTED);
                }
            }
            bidRepository.saveAll(allBids);

            // Értesítés a többi licitálónak
            for (Bid bid : allBids) {
                if (bid.getStatus() == BidStatus.REJECTED && bid.getBidder().getId() != user.getId()) {
                    notificationService.sendNotification(
                            bid.getBidder(),
                            "The product you bid on (" + product.getName() + ") was bought by someone else."
                    );
                }
            }

            // Wishlist értesítések és törlés
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

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            User uploader = product.getUser();
            notificationService.sendNotification(
                    uploader,
                    "Congratulations! Your product \"" + product.getName() + "\" has been sold."
            );
        }

        return new OrderResponseDTO(
                order.getOrderId(),
                user.getId(),
                order.getShippingAddress(),
                order.getStatus(),
                order.getTotalAmount(),
                request.getItems()
        );
    }

    /**
     * Hozzáad egy terméket a felhasználó CART státuszú rendeléséhez.
     *
     * @param userId felhasználó azonosítója
     * @param productId termék azonosítója
     */

    @Override
    public void addToCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus() == Status.SOLD) {
            throw new RuntimeException("This product is already sold and cannot be added to the cart.");
        }

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

        Optional<OrderBody> existing = orderBodyRepository.findByOrder_User_IdAndProductId(userId, productId);
        if (existing.isPresent()) return;

        OrderBody body = OrderBody.builder()
                .order(order)
                .product(product)
                .quantity(1)
                .unitPrice(product.getPrice().intValue())
                .build();

        orderBodyRepository.save(body);

        Integer orderId = order.getOrderId();

        int updatedTotal = orderBodyRepository.findAll().stream()
                .filter(ob -> ob.getOrder().getOrderId().equals(orderId))
                .mapToInt(OrderBody::getUnitPrice)
                .sum();

        order.setTotalAmount(updatedTotal);
        orderHeaderRepository.save(order);
    }

    /**
     * Lekérdezi egy rendelés részleteit azonosító alapján.
     *
     * @param orderId a rendelés azonosítója
     * @return a rendelés részletei DTO formában
     */

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
                    body.getProduct().getName(),  // productName
                    body.getProduct().getStatus().name()  // productStatus, ha a Status enum tartalmazza
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


    /**
     * Visszaadja az adott felhasználó összes rendelését.
     *
     * @param userId a felhasználó azonosítója
     * @return a rendelés DTO-k listája
     */

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

    /**
     * Minden rendelés lekérdezése (admin funkció).
     *
     * @return minden rendelés DTO formában
     */

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

package com.example.demo.product.services;

import com.example.demo.dto.OrderItemDTO;
import com.example.demo.dto.OrderRequestDTO;
import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.product.model.OrderBody;
import com.example.demo.product.model.OrderHeader;
import com.example.demo.product.model.Product;
import com.example.demo.product.model.User;
import com.example.demo.repository.OrderBodyRepository;
import com.example.demo.repository.OrderHeaderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderHeaderRepository orderHeaderRepository;
    private final OrderBodyRepository orderBodyRepository;
    private final UserRepo userRepository;
    private final ProductRepository productRepository;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderBody> orderItems = new ArrayList<>();
        int totalAmount = 0;

        OrderHeader order = OrderHeader.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PLACED)
                .build();

        order = orderHeaderRepository.save(order);

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderBody orderBody = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();

            orderItems.add(orderBody);
            totalAmount += itemDTO.getQuantity() * itemDTO.getUnitPrice();
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderBodyRepository.saveAll(orderItems));
        orderHeaderRepository.save(order);

        return new OrderResponseDTO(
                order.getOrderId(),
                user.getUser_id(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
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
                    body.getQuantity(),
                    body.getUnitPrice()
            ));
        }

        return new OrderResponseDTO(
                order.getOrderId(),
                order.getUser().getUser_id(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
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
            if (order.getUser().getUser_id() == userId) {
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
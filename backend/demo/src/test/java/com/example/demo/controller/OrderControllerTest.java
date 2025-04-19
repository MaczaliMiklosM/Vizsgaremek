package com.example.demo.controller;

import com.example.demo.dto.order.AddToCartRequestDTO;
import com.example.demo.dto.order.OrderRequestDTO;
import com.example.demo.dto.order.OrderResponseDTO;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.OrderHeader;
import com.example.demo.model.User;
import com.example.demo.repository.OrderHeaderRepository;
import com.example.demo.services.NotificationService;
import com.example.demo.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private OrderHeaderRepository orderHeaderRepository;

    /**
     * Szándékosan hibás bemenet: a request DTO üres, nem tartalmaz kötelező mezőket.
     * Ez a teszt azt ellenőrzi, hogy a backend helyesen reagál-e BAD_REQUEST válasszal.
     */
    @Test
    void testCreateOrder_BadRequest() throws Exception {
        OrderRequestDTO request = new OrderRequestDTO(); // hiányos adat
        mockMvc.perform(post("/orders/createOrder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()); // service dob hibát
    }

    /**
     * Szándékosan hibás ID: nem létező rendelést kérünk le.
     * Ez a teszt azt szimulálja, hogy a backend megfelelően kezeli a "nem található" eseteket.
     */
    @Test
    @WithMockUser
    void testGetOrderById_NotFound() throws Exception {
        when(orderService.getOrderById(99999)).thenThrow(new RuntimeException("Order not found"));

        mockMvc.perform(get("/orders/getOrderById/99999"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    void testUpdateOrderStatus_InvalidStatus() throws Exception {
        OrderHeader mockOrder = new OrderHeader();
        mockOrder.setOrderId(1);
        mockOrder.setUser(new User());

        when(orderHeaderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        mockMvc.perform(put("/orders/admin/updateStatus/1")
                        .param("status", "INVALID_STATUS"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid status value: INVALID_STATUS"));
    }

    @Test
    @WithMockUser(authorities = {"ADMIN"})
    void testUpdateOrderStatus_Success() throws Exception {
        OrderHeader order = new OrderHeader();
        order.setOrderId(1);
        order.setUser(new User());

        when(orderHeaderRepository.findById(1)).thenReturn(Optional.of(order));
        when(orderHeaderRepository.save(any())).thenReturn(order);

        mockMvc.perform(put("/orders/admin/updateStatus/1")
                        .param("status", "SHIPPED"))
                .andExpect(status().isOk())
                .andExpect(content().string("Order status updated to SHIPPED"));

        verify(notificationService).sendNotification(any(), contains("status was updated"));
    }
}

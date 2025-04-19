package com.example.demo.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetProductById_NotFound() throws Exception {
        mockMvc.perform(get("/products/getProductById/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testApproveProduct_NotFound() throws Exception {
        mockMvc.perform(post("/products/approveProduct/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteProduct_NotFound() throws Exception {
        mockMvc.perform(delete("/products/deleteProduct/999999"))
                .andExpect(status().isConflict());
    }


    /**
     * Szándékos hibás bemenet – nem adunk meg nevet, 400-as hibát várunk
     */

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCreateProduct_InvalidData() throws Exception {
        MockMultipartFile name = new MockMultipartFile("name", "", "text/plain", "".getBytes());

        mockMvc.perform(multipart("/products/createProduct")
                        .file(name))
                .andExpect(status().isConflict());
    }

    @Test
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/products/getProducts"))
                .andExpect(status().isOk());
    }
}
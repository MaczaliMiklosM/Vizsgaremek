package com.example.demo.controller;

import com.example.demo.dto.ReqRes;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.user.UserUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.services.UserManagementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserManagementService userManagementService;

    @Test
    void testRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        ReqRes response = new ReqRes();
        response.setStatusCode(200);
        response.setMessage("Registered successfully");

        Mockito.when(userManagementService.register(any())).thenReturn(response);

        mockMvc.perform(post("/management/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registered successfully"));
    }

    @Test
    void testLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        ReqRes response = new ReqRes();
        response.setToken("mock-token");

        Mockito.when(userManagementService.login(any())).thenReturn(response);

        mockMvc.perform(post("/management/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @WithMockUser(username = "test@example.com", authorities = {"USER"})
    void testGetMyProfile() throws Exception {
        ReqRes mockResponse = new ReqRes();
        mockResponse.setMessage("User found");

        Mockito.when(userManagementService.getMyInfo("test@example.com")).thenReturn(mockResponse);

        mockMvc.perform(get("/management/adminuser/get-profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User found"));
    }

    @Test
    void testCheckEmailExists() throws Exception {
        Mockito.when(userManagementService.emailExists("test@example.com")).thenReturn(true);

        mockMvc.perform(get("/management/check-email")
                        .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testUpdateUser() throws Exception {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setFull_name("Updated Name");

        User updatedUser = new User();
        updatedUser.setId(1);
        updatedUser.setFull_name("Updated Name");

        ReqRes res = new ReqRes();
        res.setUser(updatedUser);

        Mockito.when(userManagementService.updateUser(eq(1), any())).thenReturn(res);

        mockMvc.perform(put("/management/admin/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.full_name").value("Updated Name"));
    }
}

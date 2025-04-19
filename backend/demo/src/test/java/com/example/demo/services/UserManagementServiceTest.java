package com.example.demo.services;

import com.example.demo.dto.ReqRes;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserManagementServiceTest {

    @InjectMocks
    private UserManagementService userManagementService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_UserAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ReqRes response = userManagementService.register(request);

        assertEquals(400, response.getStatusCode());
        assertEquals("Email already exists", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_NewUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setCountry("Hungary");
        request.setName("Test User");
        request.setPhoneNumber("123456789");
        request.setAddress("Some Address");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");

        User userToSave = new User();
        userToSave.setId(1);
        when(userRepository.save(any(User.class))).thenReturn(userToSave);

        ReqRes response = userManagementService.register(request);

        assertEquals(200, response.getStatusCode());
        assertEquals("User Saved Successfully", response.getMessage());
        verify(notificationService).sendNotification(any(User.class), eq("Successful registration!"));
    }
}

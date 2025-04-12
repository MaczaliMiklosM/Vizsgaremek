package com.example.demo.controller;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.ReqRes;
import com.example.demo.model.User;
import com.example.demo.services.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserManagmentController {
    private final UserManagementService userManagementService;

    @Autowired
    private UserManagementService RegisterRequest;
    private UserManagementService LoginRequest;

    public UserManagmentController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(RegisterRequest.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userManagementService.login(request));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userManagementService.getMyInfo(email));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers().getUserList());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        return ResponseEntity.ok(userManagementService.getUsersById(userId).getUser());
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @RequestBody User request) {
        return ResponseEntity.ok(userManagementService.updateUser(userId, request).getUser());
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(userManagementService.deleteUser(userId));
    }
}

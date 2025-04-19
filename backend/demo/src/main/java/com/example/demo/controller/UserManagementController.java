package com.example.demo.controller;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.ReqRes;
import com.example.demo.dto.user.UserUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.services.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/management")
public class UserManagementController {

    private final UserManagementService userManagementService;
    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    /**
     * Új felhasználó regisztrálása
     *
     * @param request regisztrációs adatok
     * @return válasz JWT tokennel és státuszkóddal
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userManagementService.register(request));
    }

    /**
     * Bejelentkezés
     *
     * @param request bejelentkezési adatok
     * @return válasz JWT tokennel, felhasználói adatokkal
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userManagementService.login(request));
    }

    /**
     * Jelenleg bejelentkezett felhasználó profiljának lekérdezése
     *
     * @return profiladatok email alapján
     */
    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userManagementService.getMyInfo(email));
    }

    /**
     * Összes felhasználó lekérdezése (admin jogosultsággal)
     *
     * @return összes felhasználó listája
     */
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers().getUserList());
    }

    /**
     * Egy adott felhasználó lekérdezése az ID alapján
     *
     * @param userId a keresett felhasználó azonosítója
     * @return a felhasználó objektum
     */
    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        return ResponseEntity.ok(userManagementService.getUsersById(userId).getUser());
    }

    /**
     * Felhasználó adatainak frissítése
     *
     * @param userId a frissítendő felhasználó ID-ja
     * @param request frissítendő mezők (név, email, stb.)
     * @return frissített felhasználó objektum
     */
    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userManagementService.updateUser(userId, request).getUser());
    }

    /**
     * Ellenőrzi, hogy egy email cím már regisztrálva van-e
     *
     * @param email az ellenőrizendő email
     * @return true, ha már létezik, különben false
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userManagementService.emailExists(email);
        return ResponseEntity.ok(exists);
    }

}

package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lekéri a bejelentkezett felhasználó összes értesítését.
     *
     * @param authentication az aktuális bejelentkezett felhasználó hitelesítési objektuma
     * @return a felhasználó értesítéseinek listája
     */
    @GetMapping("/my")
    public List<Notification> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationService.getUserNotifications(user.getId());
    }

    /**
     * Visszaadja a bejelentkezett felhasználó olvasatlan értesítéseinek számát.
     *
     * @param authentication az aktuális bejelentkezett felhasználó hitelesítési objektuma
     * @return olvasatlan értesítések száma
     */
    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationService.countUnreadNotifications(user.getId());
    }

    /**
     * Az összes értesítést olvasottként jelöli a bejelentkezett felhasználónál.
     *
     * @param authentication az aktuális bejelentkezett felhasználó hitelesítési objektuma
     */
    @PutMapping("/mark-read")
    public void markNotificationsAsRead(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        notificationService.markAllAsRead(user.getId());
    }
}

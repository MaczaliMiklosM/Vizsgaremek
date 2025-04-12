package com.example.demo.services;

import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Értesítés küldése
    public void sendNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());

        // Logoljuk, hogy mi történik
        System.out.println("Mentés előtt: " + notification);

        notificationRepository.save(notification);

        // Logoljuk, hogy sikeres-e
        System.out.println("Értesítés mentve: " + notification);
    }


    // A felhasználó értesítéseinek lekérése
    public List<Notification> getUserNotifications(Integer userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}

package com.example.demo.services;

import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Új értesítést küld egy adott felhasználónak.
     *
     * @param user a felhasználó, akinek az értesítést küldjük
     * @param message az értesítés szövege
     */
    public void sendNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());


        notificationRepository.save(notification);


    }

    /**
     * Egy felhasználó összes értesítésének lekérése, időrend szerint visszafelé.
     *
     * @param userId a felhasználó azonosítója
     * @return értesítések listája
     */
    public List<Notification> getUserNotifications(Integer userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    /**
     * Megszámolja az adott felhasználó olvasatlan értesítéseit.
     *
     * @param userId a felhasználó azonosítója
     * @return az olvasatlan értesítések száma
     */
    public long countUnreadNotifications(Integer userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Minden értesítést olvasottként jelöl az adott felhasználónál.
     *
     * @param userId a felhasználó azonosítója
     */
    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }
}

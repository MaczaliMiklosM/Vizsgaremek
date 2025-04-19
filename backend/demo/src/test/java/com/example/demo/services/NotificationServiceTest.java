package com.example.demo.services;

import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @InjectMocks
    private NotificationService notificationService;

    @Mock
    private NotificationRepository notificationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendNotification() {
        User user = new User();
        user.setId(1);

        doAnswer(invocation -> {
            Notification notif = invocation.getArgument(0);
            assertEquals(user, notif.getUser());
            assertEquals("Hello there", notif.getMessage());
            assertNotNull(notif.getTimestamp());
            return null;
        }).when(notificationRepository).save(any(Notification.class));

        notificationService.sendNotification(user, "Hello there");
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void testGetUserNotifications() {
        Notification n1 = new Notification();
        Notification n2 = new Notification();
        when(notificationRepository.findByUserIdOrderByTimestampDesc(1)).thenReturn(Arrays.asList(n1, n2));

        List<Notification> result = notificationService.getUserNotifications(1);

        assertEquals(2, result.size());
        verify(notificationRepository).findByUserIdOrderByTimestampDesc(1);
    }

    @Test
    void testCountUnreadNotifications() {
        when(notificationRepository.countByUserIdAndIsReadFalse(1)).thenReturn(3L);

        long count = notificationService.countUnreadNotifications(1);

        assertEquals(3L, count);
        verify(notificationRepository).countByUserIdAndIsReadFalse(1);
    }

    @Test
    void testMarkAllAsRead() {
        Notification n1 = new Notification();
        n1.setRead(false);
        Notification n2 = new Notification();
        n2.setRead(false);

        when(notificationRepository.findByUserIdOrderByTimestampDesc(1)).thenReturn(Arrays.asList(n1, n2));

        notificationService.markAllAsRead(1);

        assertTrue(n1.isRead());
        assertTrue(n2.isRead());
        verify(notificationRepository).saveAll(anyList());
    }
}

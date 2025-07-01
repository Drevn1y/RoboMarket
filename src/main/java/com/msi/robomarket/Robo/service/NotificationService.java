package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.notification.NotificationRequestDTO;
import com.msi.robomarket.Robo.dto.notification.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {

    List<NotificationResponseDTO> findAllNotifications();
    NotificationResponseDTO createNotification(NotificationRequestDTO dto);
    NotificationResponseDTO updateNotification(Long id, NotificationRequestDTO dto);
    void deleteNotification(Long id);
    void deleteAllNotifications();

}

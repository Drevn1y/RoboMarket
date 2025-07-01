package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.notification.NotificationRequestDTO;
import com.msi.robomarket.Robo.dto.notification.NotificationResponseDTO;
import com.msi.robomarket.Robo.entity.NotificationEntity;
import com.msi.robomarket.Robo.mapper.NotificationMapper;
import com.msi.robomarket.Robo.repository.NotificationRepository;
import com.msi.robomarket.Robo.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public List<NotificationResponseDTO> findAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    public NotificationResponseDTO createNotification(NotificationRequestDTO dto) {
        return notificationMapper.toResponse(
                notificationRepository.save(
                        notificationMapper.toEntity(dto)
                ));
    }

    @Override
    public NotificationResponseDTO updateNotification(Long id, NotificationRequestDTO dto) {
        NotificationEntity notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification = notificationMapper.toUpdateEntity(notification, dto);
        notification = notificationRepository.save(notification);

        return notificationMapper.toResponse(notification);
    }


    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public void deleteAllNotifications() {
        notificationRepository.deleteAll();
    }
}

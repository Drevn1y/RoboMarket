package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.notification.NotificationRequestDTO;
import com.msi.robomarket.Robo.dto.notification.NotificationResponseDTO;
import com.msi.robomarket.Robo.entity.NotificationEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@AllArgsConstructor
@Component
public class NotificationMapper {

    public NotificationEntity toEntity(NotificationRequestDTO dto) {
        NotificationEntity entity = new NotificationEntity();
        entity.setTitle(dto.getTitle());
        entity.setMessage(dto.getMessage());
        entity.setTypeNotification(dto.getTypeNotification());
        entity.setCreatedAt(LocalDateTime.now());
        return entity;
    }

    public NotificationEntity toUpdateEntity(NotificationEntity entity, NotificationRequestDTO dto) {
        if (dto.getTitle() != null) entity.setTitle(dto.getTitle());
        if (dto.getMessage() != null) entity.setMessage(dto.getMessage());
        if (dto.getTypeNotification() != null) entity.setTypeNotification(dto.getTypeNotification());
        return entity;
    }


    public NotificationResponseDTO toResponse(NotificationEntity entity) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setNotificationId(entity.getNotificationId());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setTypeNotification(entity.getTypeNotification());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}

package com.msi.robomarket.Robo.dto.notification;

import com.msi.robomarket.Robo.enums.TypeNotification;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {

    private Long notificationId;
    private String title;
    private String message;
    private TypeNotification typeNotification;
    private LocalDateTime createdAt;

}

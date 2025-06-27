package com.msi.robomarket.Robo.entity;

import com.msi.robomarket.Robo.enums.TypeNotification;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private TypeNotification typeNotification;
    private LocalDateTime createdAt = LocalDateTime.now();

    private Boolean read = false; // для отметки "прочитано" или нет

}

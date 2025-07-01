package com.msi.robomarket.Robo.dto.notification;

import com.msi.robomarket.Robo.enums.TypeNotification;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    private String title;
    private String message;
    private TypeNotification typeNotification;

}

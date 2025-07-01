package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.notification.NotificationRequestDTO;
import com.msi.robomarket.Robo.dto.notification.NotificationResponseDTO;
import com.msi.robomarket.Robo.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("api/v1/notification")
@Tag(name = "Уведомления", description = "Отправка важных и рекламных уведомлений пользователям")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/get-all")
    public List<NotificationResponseDTO> getAllNotifications() {
        return notificationService.findAllNotifications();
    }

    @PostMapping("/create")
    public NotificationResponseDTO createNotification(@RequestBody NotificationRequestDTO notification) {
        return notificationService.createNotification(notification);
    }

    @PutMapping("/edit/{id}")
    private NotificationResponseDTO editNotification(@PathVariable Long id, @RequestBody NotificationRequestDTO notification) {
        return notificationService.updateNotification(id, notification);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity deleteAllNotifications() {
        notificationService.deleteAllNotifications();
        return ResponseEntity.ok().build();
    }

}

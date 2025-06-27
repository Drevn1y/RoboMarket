package com.msi.robomarket.Robo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class AdvertisingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long advertisingRequestId;

    private String company;
    private String name;
    private String phone;
    private String email;
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();

}

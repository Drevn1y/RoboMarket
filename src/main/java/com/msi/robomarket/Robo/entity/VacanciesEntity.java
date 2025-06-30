package com.msi.robomarket.Robo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class VacanciesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vacancyId;

    private String vacancyName;
    private String name;
    private String email;
    private String phone;
    private Boolean read = false;
    private String resumeUrl;
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();

}

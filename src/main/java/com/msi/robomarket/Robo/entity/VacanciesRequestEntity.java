package com.msi.robomarket.Robo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class VacanciesRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vacancyRequestEntityId;

    private String vacancyName;
    private String name;
    private String email;
    private String phone;

    @ElementCollection
    @CollectionTable(name = "vacancy_resumes", joinColumns = @JoinColumn(name = "vacancy_request_id"))
    @Column(name = "resume_url")
    private List<String> resumeUrl;

    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();

}

package com.msi.robomarket.Robo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class HelpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long helpId;

    private String name;
    private String email;
    private String theme;
    private String message;

    @ElementCollection
    @CollectionTable(name = "help_request_photos", joinColumns = @JoinColumn(name = "help_request_id"))
    @Column(name = "photo_url")
    private List<String> photoOrDocumentUrls;

    private LocalDateTime createdAt = LocalDateTime.now();
}

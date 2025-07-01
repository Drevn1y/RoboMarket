package com.msi.robomarket.Robo.dto.help;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HelpResponseDTO {

    private Long helpId;

    private String name;
    private String email;
    private String theme;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt = LocalDateTime.now();

}

package com.msi.robomarket.Robo.dto.vacancies;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VacanciesRequestDTO {

    private String vacancyName;
    private String name;
    private String email;
    private String phone;
    private Boolean read;
    private String message;
    private LocalDateTime createdAt;

}

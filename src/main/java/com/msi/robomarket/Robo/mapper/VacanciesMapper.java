package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.vacancies.VacanciesRequestDTO;
import com.msi.robomarket.Robo.dto.vacancies.VacanciesResponseDTO;
import com.msi.robomarket.Robo.entity.VacanciesEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class VacanciesMapper {

    public VacanciesEntity toEntity(VacanciesRequestDTO dto) {
        VacanciesEntity vacanciesEntity = new VacanciesEntity();
        vacanciesEntity.setVacancyName(dto.getVacancyName());
        vacanciesEntity.setName(dto.getName());
        vacanciesEntity.setEmail(dto.getEmail());
        vacanciesEntity.setPhone(dto.getPhone());
        vacanciesEntity.setRead(false);
        vacanciesEntity.setMessage(dto.getMessage());
        vacanciesEntity.setCreatedAt(LocalDateTime.now());

        return vacanciesEntity;
    }

    public VacanciesResponseDTO toResponseDTO(VacanciesEntity entity) {
        VacanciesResponseDTO dto = new VacanciesResponseDTO();
        dto.setVacancyId(entity.getVacancyId());
        dto.setVacancyName(entity.getVacancyName());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setRead(entity.getRead());
        dto.setMessage(entity.getMessage());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setResumeUrl(entity.getResumeUrl());
        return dto;
    }

}

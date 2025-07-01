package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.vacancies.VacanciesRequestDTO;
import com.msi.robomarket.Robo.dto.vacancies.VacanciesResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface VacanciesService {

    Optional<VacanciesResponseDTO> findVacanciesById(Long vacanciesId);
    List<VacanciesResponseDTO> findAllVacancies();
    VacanciesResponseDTO createVacancy(VacanciesRequestDTO dto);
    void markVacancyAsRead(Long vacancyId);
    void deleteVacancies(Long vacanciesId);
    VacanciesResponseDTO uploadVacancyFile(Long vacancyId, MultipartFile file);
    Resource downloadVacancyFile(Long vacancyId);

}

package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.vacancies.VacanciesRequestDTO;
import com.msi.robomarket.Robo.dto.vacancies.VacanciesResponseDTO;
import com.msi.robomarket.Robo.entity.VacanciesEntity;
import com.msi.robomarket.Robo.mapper.VacanciesMapper;
import com.msi.robomarket.Robo.repository.VacanciesRepository;
import com.msi.robomarket.Robo.service.VacanciesService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class VacanciesServiceImpl implements VacanciesService {

    private final VacanciesRepository vacanciesRepository;
    private final VacanciesMapper vacanciesMapper;

    @Override
    public Optional<VacanciesResponseDTO> findVacanciesById(Long vacanciesId) {
        return vacanciesRepository.findById(vacanciesId)
                .map(vacanciesMapper::toResponseDTO);
    }

    @Override
    public List<VacanciesResponseDTO> findAllNewVacancies() {
        return vacanciesRepository.findAll().stream()
                .filter(v -> Boolean.FALSE.equals(v.getRead())) // непрочитанные
                .map(vacanciesMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<VacanciesResponseDTO> findAllReadVacancies() {
        return vacanciesRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getRead())) // непрочитанные
                .map(vacanciesMapper::toResponseDTO)
                .toList();
    }


    @Override
    public VacanciesResponseDTO createVacancy(VacanciesRequestDTO dto) {
        return vacanciesMapper.toResponseDTO(vacanciesRepository.save(vacanciesMapper.toEntity(dto)));
    }

    @Override
    public void markVacancyAsRead(Long vacancyId) {
        Optional<VacanciesEntity> vacanciesEntity = vacanciesRepository.findById(vacancyId);
        vacanciesEntity.ifPresent(entity -> {
            entity.setRead(true);
            vacanciesRepository.save(entity);
        });
    }

    @Override
    public void deleteVacancies(Long vacanciesId) {
        vacanciesRepository.deleteById(vacanciesId);
    }

    @Override
    public VacanciesResponseDTO uploadVacancyFile(Long vacancyId, MultipartFile file) {
        String uploadDir = "uploads/vacancies";
        VacanciesEntity entity = vacanciesRepository.findById(vacancyId)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));

        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            entity.setResumeUrl(filePath.toString());
            VacanciesEntity saved = vacanciesRepository.save(entity);
            return vacanciesMapper.toResponseDTO(saved);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Resource downloadVacancyFile(Long vacancyId) {
        VacanciesEntity entity = vacanciesRepository.findById(vacancyId)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));

        try {
            Path filePath = Paths.get(entity.getResumeUrl()).normalize();
            Resource resource = new UrlResource(filePath.toUri());


            if (!resource.exists()) {
                throw new MalformedURLException("File not found: " + filePath);
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }
}

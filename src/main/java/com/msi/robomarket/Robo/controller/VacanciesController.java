package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.vacancies.VacanciesRequestDTO;
import com.msi.robomarket.Robo.dto.vacancies.VacanciesResponseDTO;
import com.msi.robomarket.Robo.service.VacanciesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Data
@RestController
@RequestMapping("api/v1/vacancies")
@Tag(name = "Вакансии", description = "Работа с вакансиями")
public class VacanciesController {

    private final VacanciesService vacanciesService;

    @GetMapping("/vacancy/id/{id}")
    public Optional<VacanciesResponseDTO> getVacancy(@PathVariable long id) {
        return vacanciesService.findVacanciesById(id);
    }

    @GetMapping("/all-vacancies")
    public List<VacanciesResponseDTO> getNewVacancies() {
        return vacanciesService.findAllVacancies();
    }

    @PostMapping("/create-vacancy")
    public VacanciesResponseDTO createVacancy(@RequestBody VacanciesRequestDTO vacancies) {
        return vacanciesService.createVacancy(vacancies);
    }

    @PostMapping("/read-vacancy/id/{id}")
    public ResponseEntity readVacancy(@PathVariable long id) {
        vacanciesService.markVacancyAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-vacancy/id/{id}")
    public ResponseEntity deleteVacancy(@PathVariable long id) {
        vacanciesService.deleteVacancies(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/upload-file/vacancy/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VacanciesResponseDTO uploadVacancy(
            @PathVariable long id,
            @RequestParam("file") MultipartFile file) {

        return vacanciesService.uploadVacancyFile(id, file);
    }

    @GetMapping("/download/vacancy-file/{id}")
    public ResponseEntity<Resource> downloadVacancy(@PathVariable long id) {
        Resource resource = vacanciesService.downloadVacancyFile(id);

        String filename = resource.getFilename();

        String contentType;
        try {
            Path path = Paths.get(resource.getURI());
            contentType = Files.probeContentType(path);
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

}

package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.help.HelpRequestDTO;
import com.msi.robomarket.Robo.dto.help.HelpResponseDTO;
import com.msi.robomarket.Robo.service.HelpService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("api/v1/help")
@Tag(name = "Помощь", description = "Работа с заявками о помощи")
public class HelpController {

    private final HelpService helpService;

    @GetMapping("/get-all")
    public List<HelpResponseDTO> getAll() {
        return helpService.findAllHelpList();
    }

    @GetMapping("/by-id/{id}")
    public HelpResponseDTO getById(@PathVariable Long id) {
        return helpService.findById(id).orElseThrow();
    }

    @PostMapping("/create")
    public HelpResponseDTO create(@RequestBody HelpRequestDTO request) {
        return helpService.create(request);
    }

    @PostMapping("/read/{id}")
    public ResponseEntity read(@PathVariable Long id) {
        helpService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        helpService.delete(id);
        return ResponseEntity.ok().build();
    }
}

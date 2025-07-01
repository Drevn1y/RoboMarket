package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.advertising.AdvertisingRequestDTO;
import com.msi.robomarket.Robo.dto.advertising.AdvertisingResponseDTO;
import com.msi.robomarket.Robo.service.AdvertisingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("api/v1/advertising")
@Tag(name = "Реклама", description = "Работа с заказами рекламы")
public class AdvertisingController {

    private final AdvertisingService advertisingService;

    @GetMapping("/all")
    public List<AdvertisingResponseDTO> findAll() {
        return advertisingService.finAllAdvertising();
    }

    @GetMapping("/get-id/{id}")
    public AdvertisingResponseDTO findById(@PathVariable Long id) {
        return advertisingService.findById(id).orElse(null);
    }

    @PostMapping("/create")
    public AdvertisingResponseDTO create(@RequestBody AdvertisingRequestDTO dto) {
        return advertisingService.create(dto);
    }

    @PostMapping("/read/{id}")
    public ResponseEntity markedRead(@PathVariable Long id) {
        advertisingService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteAdvertising(@PathVariable Long id) {
        advertisingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}

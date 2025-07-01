package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.help.HelpRequestDTO;
import com.msi.robomarket.Robo.dto.help.HelpResponseDTO;
import com.msi.robomarket.Robo.entity.HelpEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class HelpMapper {

    public HelpEntity toEntity(HelpRequestDTO dto) {
        HelpEntity entity = new HelpEntity();
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setTheme(dto.getTheme());
        entity.setMessage(dto.getMessage());
        entity.setRead(false);
        entity.setCreatedAt(LocalDateTime.now());
        return entity;
    }

    public HelpResponseDTO toResponse(HelpEntity entity) {
        HelpResponseDTO dto = new HelpResponseDTO();
        dto.setHelpId(entity.getHelpId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setTheme(entity.getTheme());
        dto.setMessage(entity.getMessage());
        dto.setRead(entity.getRead());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

}


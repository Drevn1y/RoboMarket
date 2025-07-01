package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.advertising.AdvertisingRequestDTO;
import com.msi.robomarket.Robo.dto.advertising.AdvertisingResponseDTO;
import com.msi.robomarket.Robo.entity.AdvertisingEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AdvertisingMapper {

    public AdvertisingEntity toEntity(AdvertisingRequestDTO dto) {
        AdvertisingEntity entity = new AdvertisingEntity();
        entity.setCompany(dto.getCompany());
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setMessage(dto.getMessage());
        entity.setRead(Boolean.FALSE);
        entity.setCreatedAt(LocalDateTime.now());
        return entity;
    }

    public AdvertisingResponseDTO toResponse(AdvertisingEntity entity) {
        AdvertisingResponseDTO dto = new AdvertisingResponseDTO();
        dto.setAdvertisingId(entity.getAdvertisingId());
        dto.setCompany(entity.getCompany());
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setMessage(entity.getMessage());
        dto.setRead(entity.getRead());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}

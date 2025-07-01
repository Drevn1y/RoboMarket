package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.advertising.AdvertisingRequestDTO;
import com.msi.robomarket.Robo.dto.advertising.AdvertisingResponseDTO;
import com.msi.robomarket.Robo.mapper.AdvertisingMapper;
import com.msi.robomarket.Robo.repository.AdvertisingRepository;
import com.msi.robomarket.Robo.service.AdvertisingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AdvertisingServiceImpl implements AdvertisingService {

    private final AdvertisingRepository advertisingRepository;
    private final AdvertisingMapper advertisingMapper;

    @Override
    public Optional<AdvertisingResponseDTO> findById(Long id) {
        return advertisingRepository.findById(id)
                .map(advertisingMapper::toResponse);
    }

    @Override
    public List<AdvertisingResponseDTO> finAllAdvertising() {
        return advertisingRepository.findAll()
                .stream()
                .map(advertisingMapper::toResponse)
                .toList();
    }

    @Override
    public AdvertisingResponseDTO create(AdvertisingRequestDTO dto) {
        return advertisingMapper.toResponse(advertisingRepository.save(advertisingMapper.toEntity(dto)));
    }

    @Override
    public void markAsRead(Long id) {
        advertisingRepository.findById(id)
                .ifPresent(advertising -> {
                    advertising.setRead(Boolean.TRUE);
                    advertisingRepository.save(advertising);
                });
    }

    @Override
    public void deleteById(Long id) {
        advertisingRepository.deleteById(id);
    }
}

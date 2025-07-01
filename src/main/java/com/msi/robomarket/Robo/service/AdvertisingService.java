package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.advertising.AdvertisingRequestDTO;
import com.msi.robomarket.Robo.dto.advertising.AdvertisingResponseDTO;

import java.util.List;
import java.util.Optional;

public interface AdvertisingService {

    Optional<AdvertisingResponseDTO> findById(Long id);
    List<AdvertisingResponseDTO> finAllAdvertising();
    AdvertisingResponseDTO create(AdvertisingRequestDTO dto);
    void markAsRead(Long id);
    void deleteById(Long id);

}

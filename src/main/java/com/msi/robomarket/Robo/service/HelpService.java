package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.help.HelpRequestDTO;
import com.msi.robomarket.Robo.dto.help.HelpResponseDTO;

import java.util.List;
import java.util.Optional;

public interface HelpService {

    Optional<HelpResponseDTO> findById(Long helpId);
    List<HelpResponseDTO> findAllHelpList();
    HelpResponseDTO create(HelpRequestDTO request);
    void markAsRead(Long helpId);
    void delete(Long helpId);
}

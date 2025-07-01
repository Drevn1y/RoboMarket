package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.help.HelpRequestDTO;
import com.msi.robomarket.Robo.dto.help.HelpResponseDTO;
import com.msi.robomarket.Robo.mapper.HelpMapper;
import com.msi.robomarket.Robo.repository.HelpRepository;
import com.msi.robomarket.Robo.service.HelpService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HelpServiceImpl implements HelpService {

    private final HelpRepository helpRepository;
    private final HelpMapper helpMapper;

    @Override
    public Optional<HelpResponseDTO> findById(Long helpId) {
        return helpRepository.findById(helpId)
                .map(helpMapper::toResponse);
    }

    @Override
    public List<HelpResponseDTO> findAllHelpList() {
        return helpRepository.findAll()
                .stream()
                .map(helpMapper::toResponse)
                .toList();
    }

    @Override
    public HelpResponseDTO create(HelpRequestDTO request) {
        return helpMapper.toResponse(
                helpRepository.save(
                        helpMapper.toEntity(request)
                ));
    }

    @Override
    public void markAsRead(Long helpId) {
        helpRepository.findById(helpId)
                .ifPresent(help -> {
                    help.setRead(Boolean.TRUE);
                    helpRepository.save(help);
                });
    }

    @Override
    public void delete(Long helpId) {
        helpRepository.deleteById(helpId);
    }
}

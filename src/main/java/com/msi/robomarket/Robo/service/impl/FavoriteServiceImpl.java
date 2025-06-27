package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.favorite.FavoriteRequestDTO;
import com.msi.robomarket.Robo.dto.favorite.FavoriteResponseDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.entity.FavoriteEntity;
import com.msi.robomarket.Robo.mapper.FavoriteMapper;
import com.msi.robomarket.Robo.mapper.ItemMapper;
import com.msi.robomarket.Robo.repository.FavoriteRepository;
import com.msi.robomarket.Robo.service.FavoriteService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final FavoriteMapper favoriteMapper;
    private final ItemMapper itemMapper;

    @Override
    public Optional<ItemResponseDTO> findFavoriteItemById(Long favoriteId) {
        return favoriteRepository.findById(favoriteId)
                .map(favorite -> itemMapper.toResponseDTO(favorite.getItemEntity()));
    }

    @Override
    public List<FavoriteResponseDTO> getFavoritesByUserId(Long userId) {
        return favoriteRepository.findAllByUserEntityUserId(userId)
                .stream()
                .map(favoriteMapper::toResponse)
                .toList();
    }

    @Override
    public FavoriteResponseDTO addFavorite(FavoriteRequestDTO dto) {
        FavoriteEntity favoriteEntity = favoriteMapper.toEntity(dto);
        favoriteRepository.save(favoriteEntity);
        return favoriteMapper.toResponse(favoriteEntity);
    }

    @Override
    public void removeFavorite(FavoriteRequestDTO dto) {
        favoriteRepository.findByUserEntityUserIdAndItemEntityItemId(dto.getUserId(), dto.getItemId())
                .ifPresent(favoriteRepository::delete);
    }


    @Override
    public void clearFavorite(Long userId) {
        List<FavoriteEntity> favorites = favoriteRepository.findAllByUserEntityUserId(userId);
        favoriteRepository.deleteAll(favorites);
    }

}


package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.favorite.FavoriteRequestDTO;
import com.msi.robomarket.Robo.dto.favorite.FavoriteResponseDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;

import java.util.List;
import java.util.Optional;

public interface FavoriteService {

    Optional<ItemResponseDTO> findFavoriteItemById(Long favoriteId);
    List<FavoriteResponseDTO> getFavoritesByUserId(Long userId);
    FavoriteResponseDTO addFavorite(FavoriteRequestDTO dto);
    Boolean isFavorite(FavoriteRequestDTO dto);
    void removeFavorite(FavoriteRequestDTO dto);
    void clearFavorite(Long userId);

}

package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.favorite.FavoriteRequestDTO;
import com.msi.robomarket.Robo.dto.favorite.FavoriteResponseDTO;
import com.msi.robomarket.Robo.entity.FavoriteEntity;
import com.msi.robomarket.Robo.entity.ItemEntity;
import com.msi.robomarket.Robo.repository.ItemRepository;
import com.msi.robomarket.Robo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FavoriteMapper {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    // DTO -> Entity
    public FavoriteEntity toEntity (FavoriteRequestDTO dto) {
        FavoriteEntity favorite = new FavoriteEntity();

        favorite.setUserEntity(
                userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"))
        );

        favorite.setItemEntity(
                itemRepository.findById(dto.getItemId())
                        .orElseThrow(() -> new RuntimeException("Item not found"))
        );

        return favorite;

    }

    // Entity -> Response
    public FavoriteResponseDTO toResponse(FavoriteEntity favorite) {
        FavoriteResponseDTO dto = new FavoriteResponseDTO();

        dto.setFavoriteId(favorite.getFavoriteId());
        dto.setItemId(favorite.getItemEntity().getItemId());

        return dto;

    }


}

package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.favorite.FavoriteRequestDTO;
import com.msi.robomarket.Robo.dto.favorite.FavoriteResponseDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.service.FavoriteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Data
@RestController
@RequestMapping("api/v1/favorite")
@Tag(name = "Избранное", description = "Работа с избранным")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("/item/{favoriteId}")
    public ResponseEntity<ItemResponseDTO> getFavoriteItem(@PathVariable Long favoriteId) {
        return favoriteService.findFavoriteItemById(favoriteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<FavoriteResponseDTO> getFavorite(@PathVariable Long userId) {
        return favoriteService.getFavoritesByUserId(userId);
    }

    @PostMapping("/add-to-favorite/")
    public FavoriteResponseDTO addToFavorite(@RequestBody FavoriteRequestDTO dto) {
        return favoriteService.addFavorite(dto);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<FavoriteResponseDTO> removeFavorite(@RequestBody FavoriteRequestDTO dto) {
        favoriteService.removeFavorite(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<FavoriteResponseDTO> clearFavorite(@PathVariable Long userId) {
        favoriteService.clearFavorite(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/isFavorite")
    public ResponseEntity<Map<String, Boolean>> isFavorite(@RequestBody FavoriteRequestDTO dto) {
        boolean favorite = favoriteService.isFavorite(dto);
        return ResponseEntity.ok(Map.of("isFavorite", favorite));
    }


}

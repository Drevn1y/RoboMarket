package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.item.CreateItemRequestDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.dto.item.SearchItemsRequestDTO;
import com.msi.robomarket.Robo.dto.item.UpdateItemRequestDTO;
import com.msi.robomarket.Robo.enums.ItemStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ItemService {

    // search
    List<ItemResponseDTO> getAllUserItems(Long userId);
    Optional<ItemResponseDTO> getItemById(Long userId);
    List<ItemResponseDTO> findAllItemsInModeration();
    List<ItemResponseDTO> findAllItemsInAVAILABLE();
    List<ItemResponseDTO> findAllItemsInUNAVAILABLE();

    // Поиск товаров с разными фильтрами (параметры в твоём порядке)
    List<ItemResponseDTO> searchItems(SearchItemsRequestDTO dto);

    // create update delete
    ItemResponseDTO createItem(CreateItemRequestDTO dto);
    ItemResponseDTO updateItem(Long itemId, UpdateItemRequestDTO dto);
    void deleteItem(Long itemId);

    // set status
    ItemResponseDTO setItemStatus(Long itemId, ItemStatus itemStatus);
    // Загрузка и выгрузка фото
    void uploadItemImages(Long itemId, List<MultipartFile> files); // лучше список
    void deleteItemImage(Long itemId, String imageUrlToDelete);
    List<String> getItemImages(Long itemId);


}

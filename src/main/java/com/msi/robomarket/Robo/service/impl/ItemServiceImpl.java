package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.item.CreateItemRequestDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.dto.item.SearchItemsRequestDTO;
import com.msi.robomarket.Robo.dto.item.UpdateItemRequestDTO;
import com.msi.robomarket.Robo.entity.*;
import com.msi.robomarket.Robo.enums.ItemStatus;
import com.msi.robomarket.Robo.mapper.ItemMapper;
import com.msi.robomarket.Robo.repository.ItemRepository;
import com.msi.robomarket.Robo.service.ItemService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private static final String UPLOAD_DIR = "uploads/users/item/";

    @Override
    public List<ItemResponseDTO> getAllUserItems(Long userId) {
        return itemRepository.findAllByOwnerUserId(userId)
                .stream()
                .map(itemMapper::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<ItemResponseDTO> getItemById(Long userId) {
        return itemRepository.findById(userId)
                .map(itemMapper::toResponseDTO);
    }

    @Override
    public List<ItemResponseDTO> findAllItemsInModeration() {
        return itemRepository.findByItemStatus(ItemStatus.MODERATION)
                .stream()
                .map(itemMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ItemResponseDTO> findAllItemsInAVAILABLE() {
        return itemRepository.findByItemStatus(ItemStatus.AVAILABLE)
                .stream()
                .map(itemMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ItemResponseDTO> findAllItemsInUNAVAILABLE() {
        return itemRepository.findByItemStatus(ItemStatus.UNAVAILABLE)
                .stream()
                .map(itemMapper::toResponseDTO)
                .toList();
    }


    @Override
    public List<ItemResponseDTO> searchItems(SearchItemsRequestDTO filter) {
        List<ItemEntity> items = itemRepository.findAll(); // или кастомный метод поиска

        return items.stream()
                .filter(item -> filter.getItemName() == null || item.getItemName().toLowerCase().contains(filter.getItemName().toLowerCase()))
                .filter(item -> filter.getCategory() == null || item.getCategory() == filter.getCategory())
                .filter(item -> filter.getMinPrice() == null || item.getItemPrice() >= filter.getMinPrice())
                .filter(item -> filter.getMaxPrice() == null || item.getItemPrice() <= filter.getMaxPrice())
                .filter(item -> filter.getItemType() == null || item.getItemType() == filter.getItemType())
                .filter(item -> filter.getCountry() == null || item.getCountry().equalsIgnoreCase(filter.getCountry()))
                .filter(item -> filter.getCity() == null || item.getCity().equalsIgnoreCase(filter.getCity()))
                .filter(item -> filter.getTypeSeller() == null || item.getTypeSeller() == filter.getTypeSeller())
                .filter(item -> filter.getDateTimeFrom() == null || item.getCreatedAt().isAfter(filter.getDateTimeFrom()))
                .filter(item -> filter.getDateTimeTo() == null || item.getCreatedAt().isBefore(filter.getDateTimeTo()))
                .filter(item -> item.getItemStatus() == ItemStatus.AVAILABLE)
                .map(itemMapper::toResponseDTO)
                .toList();
    }

    @Override
    public ItemResponseDTO createItem(CreateItemRequestDTO dto) {
        return itemMapper.toResponseDTO(itemRepository.save(itemMapper.toEntity(dto)));
    }

    @Override
    public ItemResponseDTO updateItem(Long itemId, UpdateItemRequestDTO dto) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

         itemMapper.toEntity(item, dto);
         itemRepository.save(item);
         return itemMapper.toResponseDTO(itemRepository.save(item));

    }

    @Override
    public void deleteItem(Long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Override
    public ItemResponseDTO setItemStatus(Long itemId, ItemStatus itemStatus) {

        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        item.setItemStatus(itemStatus);

        itemRepository.save(item);
        return itemMapper.toResponseDTO(item);

    }

    @Override
    public void uploadItemImages(Long itemId, List<MultipartFile> files) {
        if (!itemRepository.existsById(itemId)) {
            throw new RuntimeException("Item not found");
        }

        try {
            File upload = new File(UPLOAD_DIR);
            if (!upload.exists()) {
                boolean created = upload.mkdirs();
                if (!created) {
                    throw new RuntimeException("Failed to create directory");
                }
            }
            List<String> imagePaths = new ArrayList<>();

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR, fileName);
                Files.write(filePath, file.getBytes());

                imagePaths.add(filePath.toString());
            }

            ItemEntity item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found"));


            item.getImageUrls().addAll(imagePaths);
            itemRepository.save(item);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    // ИИ исправил мой баг
    @Override
    public void deleteItemImage(Long itemId, String imageUrlToDelete) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        List<String> images = item.getImageUrls();

        // 1. Преобразуем полный URL в относительный путь
        String baseUrl = "http://localhost:8080/";
        String relativeUrlPath = imageUrlToDelete.startsWith(baseUrl)
                ? imageUrlToDelete.substring(baseUrl.length()) // => uploads/users/item/abc.jpg
                : imageUrlToDelete;

        // Приводим его к виду, как в базе — с обратными слешами
        String normalizedForComparison = relativeUrlPath.replace("/", "\\"); // в базе — uploads\...

        // 2. Удаляем строку из imageUrls
        boolean removed = images.removeIf(img -> img.equalsIgnoreCase(normalizedForComparison));

        // 3. Удаляем файл с диска (можно с прямыми или File.separator)
        Path filePath = Paths.get(relativeUrlPath.replace("/", File.separator));
        try {
            boolean deleted = Files.deleteIfExists(filePath);
            System.out.println("File deleted from disk? " + deleted);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }

        // 4. Сохраняем обновления
        item.setImageUrls(images);
        itemRepository.save(item);
    }

    @Override
    public List<String> getItemImages(Long itemId) {
        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        List<String> localPaths = item.getImageUrls();

        // Базовый URL твоего сервера (замени на свой адрес и порт)
        String baseUrl = "http://localhost:8080/";

        return localPaths.stream()
                .map(path -> path.replace("\\", "/"))  // меняем обратные слеши на прямые
                .map(path -> baseUrl + path)           // добавляем базовый URL спереди
                .collect(Collectors.toList());
    }

}

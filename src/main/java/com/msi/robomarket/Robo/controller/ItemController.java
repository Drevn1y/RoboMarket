package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.item.CreateItemRequestDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.dto.item.SearchItemsRequestDTO;
import com.msi.robomarket.Robo.dto.item.UpdateItemRequestDTO;
import com.msi.robomarket.Robo.enums.Category;
import com.msi.robomarket.Robo.enums.ItemStatus;
import com.msi.robomarket.Robo.service.ItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Data
@RestController
@RequestMapping("api/v1/items")
@Tag(name = "Объявления", description = "Работа с Объявлениями")
public class ItemController {

    private final ItemService itemService;

    @GetMapping("/get-all/user/{id}/items")
    public List<ItemResponseDTO> getAllUserItems(@PathVariable long id) {
        return itemService.getAllUserItems(id);
    }

    @GetMapping("/get/id/{id}")
    public Optional<ItemResponseDTO> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    @GetMapping("/get-all-available")
    public List<ItemResponseDTO> getAllAvailableItems() {
        return itemService.findAllItemsInAVAILABLE();
    }

    @GetMapping("/get-all-moderation")
    public List<ItemResponseDTO> getAllModerationItems() {
        return itemService.findAllItemsInModeration();
    }

    @GetMapping("/get-all-unavailable")
    public List<ItemResponseDTO> getAllUnavailableItems() {
        return itemService.findAllItemsInUNAVAILABLE();
    }


    @PostMapping("/search")
    public List<ItemResponseDTO> searchItem(@RequestBody SearchItemsRequestDTO dto) {
        return itemService.searchItems(dto);
    }

    @PostMapping("/create")
    public ItemResponseDTO createItem(@RequestBody CreateItemRequestDTO dto) {
        return itemService.createItem(dto);
    }

    @PutMapping("edit/item/id/{itemId}")
    public ItemResponseDTO updateItem(@PathVariable Long itemId, @RequestBody UpdateItemRequestDTO dto) {
        return itemService.updateItem(itemId, dto);
    }

    @DeleteMapping("/delete/id/{id}")
    void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }

    @PutMapping("/edit-status/{itemId}")
    public ItemResponseDTO updateStatusItem(@PathVariable Long itemId, ItemStatus itemStatus) {
        return itemService.setItemStatus(itemId, itemStatus);
    }

    @PostMapping(value = "/upload/item/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadItem(
            @PathVariable Long id,
            @RequestPart List<MultipartFile> files) {
        itemService.uploadItemImages(id, files);
        return ResponseEntity.ok("success");
    }


    @DeleteMapping("/delete/photo/{itemId}")
    void deletePhoto(@PathVariable Long itemId, @RequestParam String photoUrl) {
        itemService.deleteItemImage(itemId, photoUrl);
    }

    @GetMapping("/item/photos/{itemId}")
    public ResponseEntity<List<String>> getItemImages(@PathVariable Long itemId) {
        List<String> imageUrls = itemService.getItemImages(itemId);
        return ResponseEntity.ok(imageUrls);
    }

    @GetMapping("/get-by-category/")
    public List<ItemResponseDTO> getItemsByCategory(@RequestParam Category category) {
        return itemService.findByCategory(category);
    }

}

package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.item.CreateItemRequestDTO;
import com.msi.robomarket.Robo.dto.item.ItemResponseDTO;
import com.msi.robomarket.Robo.dto.item.SearchItemsRequestDTO;
import com.msi.robomarket.Robo.dto.item.UpdateItemRequestDTO;
import com.msi.robomarket.Robo.entity.ItemEntity;
import com.msi.robomarket.Robo.entity.UserEntity;
import com.msi.robomarket.Robo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemMapper {

    private final UserRepository userRepository;

    // DTO -> Entity
    public ItemEntity toEntity(CreateItemRequestDTO dto) {
        ItemEntity item = new ItemEntity();

        UserEntity owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        item.setOwner(owner);

        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setItemDescription(dto.getItemDescription());
        item.setTypeSeller(dto.getTypeSeller());
        item.setItemType(dto.getItemType());
        item.setItemPrice(dto.getItemPrice());
        item.setTypePrice(dto.getTypePrice());
        item.setTypeMoney(dto.getTypeMoney());

        item.setCountry(dto.getCountry());
        item.setCity(dto.getCity());
        item.setAddress(dto.getAddress());

        item.setName(dto.getName());
        item.setPhone(dto.getPhone());
        item.setEmail(dto.getEmail());

        return item;
    }

    // DTO -> Entity
    public void toEntity(ItemEntity item, UpdateItemRequestDTO dto) {

        if (dto.getItemName() != null) item.setItemName(dto.getItemName());
        if (dto.getCategory() != null) item.setCategory(dto.getCategory());
        if (dto.getItemDescription() != null) item.setItemDescription(dto.getItemDescription());
        if (dto.getTypeSeller() != null) item.setTypeSeller(dto.getTypeSeller());
        if (dto.getItemType() != null) item.setItemType(dto.getItemType());
        if (dto.getItemPrice() != null) item.setItemPrice(dto.getItemPrice());
        if (dto.getTypePrice() != null) item.setTypePrice(dto.getTypePrice());
        if (dto.getTypeMoney() != null) item.setTypeMoney(dto.getTypeMoney());

        if (dto.getCountry() != null) item.setCountry(dto.getCountry());
        if (dto.getCity() != null) item.setCity(dto.getCity());
        if (dto.getAddress() != null) item.setAddress(dto.getAddress());

        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getPhone() != null) item.setPhone(dto.getPhone());
        if (dto.getEmail() != null) item.setEmail(dto.getEmail());

    }

    // Entity -> Response
    public ItemResponseDTO toResponseDTO(ItemEntity entity) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setOwnerUserId(entity.getOwner().getUserId());
        dto.setItemId(entity.getItemId());
        dto.setItemName(entity.getItemName());
        dto.setCategory(entity.getCategory());
        dto.setItemDescription(entity.getItemDescription());
        dto.setTypeSeller(entity.getTypeSeller());
        dto.setItemType(entity.getItemType());
        dto.setItemPrice(entity.getItemPrice());
        dto.setTypePrice(entity.getTypePrice());
        dto.setTypeMoney(entity.getTypeMoney());

        dto.setCountry(entity.getCountry());
        dto.setCity(entity.getCity());
        dto.setAddress(entity.getAddress());

        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());

        dto.setItemStatus(entity.getItemStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setImageUrls(entity.getImageUrls());

        return dto;

    }
}

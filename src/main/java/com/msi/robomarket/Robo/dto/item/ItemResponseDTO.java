package com.msi.robomarket.Robo.dto.item;

import com.msi.robomarket.Robo.enums.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ItemResponseDTO {

    private Long ownerUserId;
    private Long itemId;

    private String itemName;
    private Category category;
    private String itemDescription;
    private TypeSeller typeSeller;
    private ItemType itemType;
    private Double itemPrice;
    private TypePrice typePrice;
    private TypeMoney typeMoney;

    private String country;
    private String city;
    private String address;

    private String name;
    private String phone;
    private String email;

    private ItemStatus itemStatus;
    private LocalDateTime createdAt;

    private List<String> imageUrls;

}

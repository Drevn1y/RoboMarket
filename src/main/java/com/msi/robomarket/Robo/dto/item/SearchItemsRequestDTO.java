package com.msi.robomarket.Robo.dto.item;

import com.msi.robomarket.Robo.enums.Category;
import com.msi.robomarket.Robo.enums.ItemStatus;
import com.msi.robomarket.Robo.enums.ItemType;
import com.msi.robomarket.Robo.enums.TypeSeller;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SearchItemsRequestDTO {

    String itemName;
    Category category;
    Double minPrice;
    Double maxPrice;
    ItemType itemType;
    String country;
    String city;
    TypeSeller TypeSeller;
    LocalDateTime dateTimeFrom;
    LocalDateTime dateTimeTo;

    ItemStatus itemStatus;

}

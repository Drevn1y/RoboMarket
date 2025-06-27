package com.msi.robomarket.Robo.dto.item;

import com.msi.robomarket.Robo.enums.*;
import lombok.Data;

@Data
public class UpdateItemRequestDTO {

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

}

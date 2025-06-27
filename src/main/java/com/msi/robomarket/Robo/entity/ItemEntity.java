package com.msi.robomarket.Robo.entity;

import com.msi.robomarket.Robo.enums.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import static com.msi.robomarket.Robo.enums.ItemStatus.MODERATION;

@Data
@Entity
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String itemName;
    @Enumerated(EnumType.STRING)
    private Category category;
    private String itemDescription;
    @Enumerated(EnumType.STRING)
    private TypeSeller typeSeller;
    @Enumerated(EnumType.STRING)
    private ItemType itemType;
    private Double itemPrice;
    @Enumerated(EnumType.STRING)
    private TypePrice typePrice;
    @Enumerated(EnumType.STRING)
    private TypeMoney typeMoney;
    private String country;
    private String city;
    private String address;
    private String name;
    private String phone;
    private String email;
    @Enumerated(EnumType.STRING)
    private ItemStatus itemStatus = MODERATION;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserEntity owner;

}

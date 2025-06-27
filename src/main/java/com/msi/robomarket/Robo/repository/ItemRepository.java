package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.enums.Category;
import com.msi.robomarket.Robo.entity.ItemEntity;
import com.msi.robomarket.Robo.enums.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    List<ItemEntity> findItemsByItemName(String itemName);
    List<ItemEntity> findItemsByCategory(Category category);
    List<ItemEntity> findAllByOwnerUserId(Long userId);
    List<ItemEntity> findByItemStatus(ItemStatus status);

}

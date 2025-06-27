package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.entity.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    List<FavoriteEntity> findAllByUserEntityUserId(Long userId);
    Optional<FavoriteEntity> findByUserEntityUserIdAndItemEntityItemId(Long userId, Long itemId);


}

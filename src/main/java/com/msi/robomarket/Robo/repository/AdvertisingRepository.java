package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.entity.AdvertisingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvertisingRepository extends JpaRepository<AdvertisingEntity, Long> {

}

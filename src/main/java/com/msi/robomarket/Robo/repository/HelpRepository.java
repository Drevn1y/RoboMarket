package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.entity.HelpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelpRepository extends JpaRepository<HelpEntity, Long> {

}

package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.entity.VacanciesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VacanciesRepository extends JpaRepository<VacanciesEntity, Long> {

    VacanciesEntity findAllVacancies();
    VacanciesEntity findVacanciesRequest(Long vacancyId);

}

package com.msi.robomarket.Robo.repository;

import com.msi.robomarket.Robo.entity.UserEntity;
import com.msi.robomarket.Robo.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findUserByUserId(Long userId);
    Optional<UserEntity> getUserByEmail(String email);
    Optional<UserEntity> getUserByPhone(String phone);
    List<UserEntity> findAllByRole(Role role);

}

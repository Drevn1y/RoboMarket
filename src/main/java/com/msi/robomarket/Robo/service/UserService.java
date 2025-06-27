package com.msi.robomarket.Robo.service;

import com.msi.robomarket.Robo.dto.auth.LoginResponseDTO;
import com.msi.robomarket.Robo.dto.user.CreateUserRequestDTO;
import com.msi.robomarket.Robo.dto.auth.LoginRequestDTO;
import com.msi.robomarket.Robo.dto.user.UpdateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UserResponseDTO;
import com.msi.robomarket.Robo.enums.Role;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // search
    List<UserResponseDTO> getAllUsers();
    Optional<UserResponseDTO> getUserById(Long id);
    Optional<UserResponseDTO> findUserByPhone(String phone);
    Optional<UserResponseDTO> findUserByEmail(String email);

    // create, update, delete
    UserResponseDTO createUser(CreateUserRequestDTO dto);
    UserResponseDTO updateUser(Long userId, UpdateUserRequestDTO dto);
    void deleteUser(Long userId);

    // Login
    LoginResponseDTO login(LoginRequestDTO dto);

    // ADMIN
    List<UserResponseDTO> findAllAdmin();

    void blockUser(Long userId);

    void unblockUser(Long userId);

    void changeUserRole(Long userId, Role newRole);

    // Загрузка и выгрузка фото профиля
    void uploadPhoto(Long userId, MultipartFile file);
    Resource getUserPhoto(Long userId);



}


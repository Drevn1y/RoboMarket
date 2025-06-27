package com.msi.robomarket.Robo.service.impl;

import com.msi.robomarket.Robo.dto.auth.LoginRequestDTO;
import com.msi.robomarket.Robo.dto.auth.LoginResponseDTO;
import com.msi.robomarket.Robo.dto.user.CreateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UpdateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UserResponseDTO;
import com.msi.robomarket.Robo.entity.UserEntity;
import com.msi.robomarket.Robo.enums.Role;
import com.msi.robomarket.Robo.enums.UserStatus;
import com.msi.robomarket.Robo.mapper.UserMapper;
import com.msi.robomarket.Robo.repository.UserRepository;
import com.msi.robomarket.Robo.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private static final String UPLOAD_DIR = "uploads/users/logo/";


    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findUserByUserId(id)
                .map(userMapper::toResponse);
    }

    @Override
    public Optional<UserResponseDTO> findUserByPhone(String phone) {
        return userRepository.getUserByPhone(phone)
                .map(userMapper::toResponse);
    }

    @Override
    public Optional<UserResponseDTO> findUserByEmail(String email) {
        return userRepository.getUserByEmail(email)
                .map(userMapper::toResponse);
    }

    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO dto) {
        UserEntity userEntity = userMapper.toEntity(dto);          // Преобразуем DTO в Entity
        UserEntity savedUser = userRepository.save(userEntity);    // Сохраняем Entity в базу, получаем сохранённый объект (с id и пр.)
        return userMapper.toResponse(savedUser);                   // Преобразуем сохранённый Entity в Response DTO и возвращаем
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        // 1. Найти по email
        Optional<UserEntity> user = userRepository.getUserByEmail(dto.getEmail());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        UserEntity userEntity = user.get();

        if (!userEntity.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        if (userEntity.getUserStatus() == UserStatus.BLOCKED ) {
            throw new RuntimeException("Аккаунт заблокирован");
        }

        return userMapper.toLoginResponse(userEntity);

    }

    @Override
    public List<UserResponseDTO> findAllAdmin() {
        return userRepository.findAllByRole(Role.ADMIN)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }


    @Override
    public UserResponseDTO updateUser(Long userId, UpdateUserRequestDTO dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Проверка текущего пароля
        if (!Objects.equals(dto.getNowPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }

        // Если пользователь указал новый пароль — проверяем совпадение
        if (dto.getNewPassword() != null && !Objects.equals(dto.getNewPassword(), dto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords don't match");
        }

        // Обновляем пароль, если есть
        if (dto.getNewPassword() != null) {
            user.setPassword(dto.getNewPassword());
        }

        userMapper.toUpdateEntity(user, dto);
        UserEntity savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public void blockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setUserStatus(UserStatus.BLOCKED);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setUserStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Override
    public void changeUserRole(Long userId, Role newRole) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(newRole);
        userRepository.save(user);
    }

    @Override
    public void uploadPhoto(Long userId, MultipartFile file) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // Создание папки если нет
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    throw new RuntimeException("Could not create upload directory");
                }
            }

            // Генерация уникального имени файла
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // Сохранение файла
            Files.write(filePath, file.getBytes());

            // Сохранение пути в БД
            user.setProfileUrl(filePath.toString());
            userRepository.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Error saving photo", e);
        }
    }

    @Override
    public Resource getUserPhoto(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String photoPath = user.getProfileUrl(); // путь к фото
        if (photoPath == null) {
            throw new RuntimeException("User has no photo");
        }

        try {
            Path path = Paths.get(photoPath);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("Photo file not found");
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid photo path", e);
        }
    }


}


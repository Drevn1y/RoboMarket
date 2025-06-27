package com.msi.robomarket.Robo.mapper;

import com.msi.robomarket.Robo.dto.auth.LoginResponseDTO;
import com.msi.robomarket.Robo.dto.user.CreateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UpdateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UserResponseDTO;
import com.msi.robomarket.Robo.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    // DTO → Entity
    public UserEntity toEntity(CreateUserRequestDTO dto) {

        UserEntity user = new UserEntity();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        return user;

    }

    // DTO → Entity
    public void toUpdateEntity(UserEntity user, UpdateUserRequestDTO dto) {

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getBirthDate() != null) user.setBirthDate(dto.getBirthDate());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());
        if (dto.getCity() != null) user.setCity(dto.getCity());

    }

    // Entity -> Response
    public UserResponseDTO toResponse(UserEntity user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setBirthDate(user.getBirthDate());
        dto.setGender(user.getGender());
        dto.setCountry(user.getCountry());
        dto.setCity(user.getCity());
        dto.setProfileUrl(user.getProfileUrl());
        dto.setRole(user.getRole().toString());
        dto.setUserStatus(user.getUserStatus().toString());
        return dto;

    }
    // login
    public LoginResponseDTO toLoginResponse(UserEntity user) {
        LoginResponseDTO dto = new LoginResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }


}

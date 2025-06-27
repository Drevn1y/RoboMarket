package com.msi.robomarket.Robo.dto.user;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponseDTO {

    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String gender;
    private String country;
    private String city;
    private String role;
    private String userStatus;
    private String profileUrl;

}


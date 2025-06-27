package com.msi.robomarket.Robo.dto.user;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class UpdateUserRequestDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String gender;
    private String country;
    private String city;
    private String nowPassword;
    private String newPassword;
    private String confirmPassword;

}

package com.msi.robomarket.Robo.dto.user;

import com.msi.robomarket.Robo.enums.Role;
import lombok.Data;

import java.util.Date;

@Data
public class CreateUserRequestDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;

}

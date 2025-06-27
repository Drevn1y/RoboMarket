package com.msi.robomarket.Robo.dto.auth;

import com.msi.robomarket.Robo.enums.Role;
import lombok.Data;

@Data
public class LoginResponseDTO {
    private Long userId;
    private String email;
    private Role role;
}

package com.msi.robomarket.Robo.dto.advertising;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdvertisingRequestDTO {

    private String company;
    private String name;
    private String phone;
    private String email;
    private String message;

}

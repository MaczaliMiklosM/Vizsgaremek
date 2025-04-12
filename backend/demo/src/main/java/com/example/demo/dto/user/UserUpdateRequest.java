package com.example.demo.dto.user;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String full_name;
    private String email;
    private String phone_number;
    private String address;
    private String country;
}

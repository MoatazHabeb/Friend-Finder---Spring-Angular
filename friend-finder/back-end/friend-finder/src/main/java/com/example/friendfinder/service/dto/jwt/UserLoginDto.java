package com.example.friendfinder.service.dto.jwt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginDto {
    private String email;
    private String password;
}

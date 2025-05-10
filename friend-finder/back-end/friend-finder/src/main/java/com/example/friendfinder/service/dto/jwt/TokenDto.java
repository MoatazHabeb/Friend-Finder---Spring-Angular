package com.example.friendfinder.service.dto.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
public class TokenDto {
    private String token;

    private List<String> roles;
}

package com.example.friendfinder.service.jwt;

import com.example.friendfinder.service.dto.jwt.TokenDto;
import com.example.friendfinder.service.dto.jwt.UserLoginDto;
import jakarta.transaction.SystemException;

public interface AuthService {
    TokenDto login(UserLoginDto userLoginDto) throws SystemException;
}

package com.example.friendfinder.service.jwt;

import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.jwt.UserDto;
import jakarta.transaction.SystemException;

import java.io.IOException;

public interface UserService {
    Users getUserbyEmail(String email) throws SystemException;
    Users checkUserExistByToken(String token) throws SystemException;
    void createUser (UserDto userDto) throws SystemException;
    UserDto getUserById( Long id);
    UserDto getMyProfile();


}

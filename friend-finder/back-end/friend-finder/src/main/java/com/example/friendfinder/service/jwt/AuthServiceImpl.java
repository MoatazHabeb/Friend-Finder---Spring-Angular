package com.example.friendfinder.service.jwt;

import com.example.friendfinder.config.jwt.TokenHandler;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.jwt.TokenDto;
import com.example.friendfinder.service.dto.jwt.UserLoginDto;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class AuthServiceImpl implements AuthService{
    @Autowired
    private UserService userService;

    @Autowired
    private TokenHandler tokenHandler;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public TokenDto login(UserLoginDto userLoginDto) throws SystemException {
        Users users = userService.getUserbyEmail(userLoginDto.getEmail());

        if (!passwordEncoder.matches(userLoginDto.getPassword(), users.getPassword())) {
            throw new BadCredentialsException("error.userNotExist");
        }

        List<String> rolse = users.getRoles().stream().map(role -> role.getCode().substring(5)).collect(Collectors.toList());
        return new TokenDto(tokenHandler.createToken(users), rolse);
    }
}

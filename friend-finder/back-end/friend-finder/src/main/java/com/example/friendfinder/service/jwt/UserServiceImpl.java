package com.example.friendfinder.service.jwt;

import com.example.friendfinder.config.jwt.TokenHandler;
import com.example.friendfinder.mapper.UserMapper;
import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Roles;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.FriendRepository;
import com.example.friendfinder.repo.jwt.RolesRepository;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.dto.jwt.UserDto;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private TokenHandler tokenHandler;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FriendRepository friendRepository;

    @Override
    public Users getUserbyEmail(String email) throws SystemException {
        Users users = userRepository.findByEmail(email);


        if (users == null) {

            throw new RuntimeException("error.invalid.email");
        }

        return users;
    }



    @Override
    public Users checkUserExistByToken(String token) throws SystemException {
        String email = tokenHandler.getSubject(token);

        if (Objects.isNull(email)) {
            return null;
        }

        return userRepository.findByEmail(email);
    }

    @Override
    public void createUser(UserDto userDto) throws SystemException {
        if (userDto.getId() != null) {
            throw new SystemException("id must be null");
        }
        Users clientExits = userRepository.findByEmail(userDto.getEmail());
        if (clientExits != null) {
            throw new RuntimeException("error.userExist");
        }

        Users users = UserMapper.USER_MAPPER.toEntity(userDto);
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        Roles role = rolesRepository.findByCode("ROLE_USER");
        if (role == null) {
            throw new SystemException("role not exist");
        }
        List<Roles> roles = List.of(role);
        users.setRoles(roles);
        Users savedUser = userRepository.save(users);  // Save first


    }

    @Override
    public UserDto getUserById(Long id) {
        Users users = userRepository.findById(id).get();
        return UserMapper.USER_MAPPER.toDto(users);
    }

    @Override
    public UserDto getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users users = (Users) authentication.getPrincipal(); // Authenticated user

        Optional<Users> optionalUser = userRepository.findById(users.getId());
        Users user = optionalUser.get();
        UserDto userDto = UserMapper.USER_MAPPER.toDto(user);

        return userDto;
    }
    @Override
    public UserDto getProfile(Long id) {
        Optional<Users> optionalUser = userRepository.findById(id);
        Users user = optionalUser.get();

        UserDto userDto = UserMapper.USER_MAPPER.toDto(user);

        return userDto;
    }
    @Override
    public List<Users> getUsersNotFriendsWith(Long userId) {
        return userRepository.findUsersNotFriendsWith(userId);
    }
    @Override
    public void save(Users user) {
        userRepository.save(user);
    }
}

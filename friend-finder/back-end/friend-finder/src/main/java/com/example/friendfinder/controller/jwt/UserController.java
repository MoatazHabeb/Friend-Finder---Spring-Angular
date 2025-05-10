package com.example.friendfinder.controller.jwt;

import com.example.friendfinder.mapper.UserMapper;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.dto.jwt.TokenDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import com.example.friendfinder.service.dto.jwt.UserLoginDto;
import com.example.friendfinder.service.jwt.AuthService;
import com.example.friendfinder.service.jwt.UserService;
import jakarta.transaction.SystemException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    ResponseEntity<TokenDto> login(@RequestBody UserLoginDto userLoginDto) throws SystemException {

        return ResponseEntity.ok(authService.login(userLoginDto));
    }



    @PostMapping("/create-user")
    ResponseEntity<Void> createUser(@RequestBody @Valid UserDto userDto) throws SystemException {
        userService.createUser(userDto);
        return ResponseEntity.created(URI.create("/user/addUserWithRoles")).build();
    }

    @PostMapping("/upload-profile-image")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        // Create directory if not exists
        String uploadDir = "uploads/profile-images/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Generate unique file name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Define the file path to save
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());

        // Save just the relative path without the "uploads" prefix
        user.setImage("/profile-images/" + fileName); // example: /profile-images/abc.jpg
        userRepository.save(user);

        return ResponseEntity.ok("Profile image uploaded and path saved successfully.");
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDto> getMyProfile() {
        UserDto profile = userService.getMyProfile();
        // Make sure the image URL is complete
        if (profile.getImage() != null && !profile.getImage().startsWith("http")) {
            profile.setImage("http://localhost:4040" + profile.getImage());
        }
        return ResponseEntity.ok(profile);
    }
}
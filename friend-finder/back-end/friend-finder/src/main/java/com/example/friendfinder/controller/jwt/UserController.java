package com.example.friendfinder.controller.jwt;

import com.example.friendfinder.config.WebConfig;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private AuthService authService;
    @Value("${server.base-url}")
    private String baseUrl;
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    private final String uploadDir = "uploads/";
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
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) throws IOException {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        // Get current working directory
        String currentDir = new File("").getAbsolutePath();

        // Append "friend-finder" to path if it's not already there
        if (!currentDir.endsWith("friend-finder")) {
            currentDir = currentDir + File.separator + "friend-finder";
        }

        String uploadDir = currentDir + File.separator + "uploads" + File.separator;

        System.out.println("Saving file to directory: " + uploadDir);

        // Create filename with timestamp to avoid duplicates
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Ensure directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            System.out.println("Directory created: " + created);
        }

        // Save file
        File savedFile = new File(uploadDir + fileName);
        Files.write(savedFile.toPath(), file.getBytes());

        System.out.println("File saved at: " + savedFile.getAbsolutePath());

        // Update user record
        user.setImage("/uploads/" + fileName);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "imageUrl", "/uploads/" + fileName,
                "absolutePath", savedFile.getAbsolutePath()
        ));
    }


    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDto> getMyProfile() {
        UserDto profile = userService.getMyProfile();

        // Add server domain to image URL if it doesn't already have it
        if (profile.getImage() != null && !profile.getImage().startsWith("http")) {
            profile.setImage(baseUrl + profile.getImage());
        }

        // Log the profile being returned
        logger.info("Returning profile with image URL: " + profile.getImage());

        return ResponseEntity.ok(profile);
    }



    // Add a dedicated endpoint to test if images are accessible
    @GetMapping("/test-image-access")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> testImageAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();

        if (user.getImage() == null || user.getImage().isEmpty()) {
            response.put("status", "No image set for user");
            return ResponseEntity.ok(response);
        }

        // Try to access the image file
        String imagePath = user.getImage();
        if (imagePath.startsWith("/")) {
            imagePath = imagePath.substring(1); // Remove leading slash
        }

        String fullPath = "uploads/" + imagePath;
        File imageFile = new File(fullPath);

        response.put("imagePathInDb", user.getImage());
        response.put("fullPathChecked", fullPath);
        response.put("fileExists", imageFile.exists());
        response.put("fileReadable", imageFile.canRead());
        response.put("fileSize", imageFile.exists() ? imageFile.length() : 0);
        response.put("absolutePath", imageFile.getAbsolutePath());

        return ResponseEntity.ok(response);
    }
}
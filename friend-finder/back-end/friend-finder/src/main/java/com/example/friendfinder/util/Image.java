package com.example.friendfinder.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Image {
    public static void saveImage(MultipartFile multipartFile) throws IOException {
        String folder1 = "D:\\Friend-Finder-SpringBoot-MVC-Thymeleaf\\target\\classes\\static\\photos\\";
        byte[] bytes = multipartFile.getBytes();
        Path path1 = Paths.get(folder1 + multipartFile.getOriginalFilename());
        Files.write(path1,bytes);
    }
}

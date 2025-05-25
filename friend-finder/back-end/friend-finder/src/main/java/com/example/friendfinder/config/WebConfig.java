package com.example.friendfinder.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String currentDir = new File("").getAbsolutePath(); // This is back-end

        String uploadDir = currentDir + File.separator + "friend-finder" + File.separator + "upload" + File.separator;
        String uploadsDir = currentDir + File.separator + "friend-finder" + File.separator + "uploads" + File.separator;

        System.out.println("Upload Dir (post files): " + uploadDir);
        System.out.println("Upload Dir (profile images): " + uploadsDir);

        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:C:/Users/User/FacebookFriend/friend-finder/back-end/friend-finder/upload/")
                .setCachePeriod(0);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsDir)
                .setCachePeriod(0);
    }
}
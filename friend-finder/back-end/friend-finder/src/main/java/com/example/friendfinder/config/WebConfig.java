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
            // Get current directory (likely "back-end")
            String currentDir = new File("").getAbsolutePath();

            String uploadDir = currentDir + File.separator + "friend-finder" + File.separator + "uploads" + File.separator;

            String resourceLocation = "file:" + uploadDir;

            System.out.println("WebConfig - Current working directory: " + currentDir);
            System.out.println("WebConfig - Resource handler configured with path: " + resourceLocation);

            registry
                    .addResourceHandler("/uploads/**")
                    .addResourceLocations(resourceLocation)
                    .setCachePeriod(0);
        }
}
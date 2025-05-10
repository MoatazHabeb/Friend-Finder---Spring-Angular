package com.example.friendfinder;

import com.example.friendfinder.sittings.TokenConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(TokenConfig.class)
@ConfigurationPropertiesScan
public class FriendFinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(FriendFinderApplication.class, args);
    }

}

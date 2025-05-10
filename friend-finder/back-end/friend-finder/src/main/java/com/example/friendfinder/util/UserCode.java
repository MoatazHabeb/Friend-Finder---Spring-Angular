package com.example.friendfinder.util;

import java.util.UUID;

public class UserCode {
    public static String extractCode(){

        return UUID.randomUUID().toString();
    }
}

package com.example.friendfinder.controller;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<Friend>> getPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(friendService.getPendingRequests(userId));
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<Friend>> getFriends(@PathVariable Long userId) {
        return ResponseEntity.ok(friendService.getFriends(userId));
    }
}

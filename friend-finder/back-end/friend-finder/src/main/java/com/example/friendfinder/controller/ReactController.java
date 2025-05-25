package com.example.friendfinder.controller;

import com.example.friendfinder.service.ReactService;
import com.example.friendfinder.service.dto.CommentDto;
import com.example.friendfinder.service.dto.ReactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReactController {
    @Autowired
    private ReactService reactService;
    @PostMapping("/posts/{postId}/like")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ReactDto> likePost(@PathVariable Long postId){

        return ResponseEntity.ok(reactService.likePost(postId));
    }
    @PostMapping("/posts/{postId}/dislike")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ReactDto> dislikePost(@PathVariable Long postId){
        return ResponseEntity.ok(reactService.dislikePost(postId));
    }

    @GetMapping("countandgetlikes/{postId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<ReactDto>>countAndGetLikes(@PathVariable Long postId){
        return ResponseEntity.ok(reactService.countAndGetLikes(postId));
    }

    @GetMapping("countandgetdislikes/{postId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<ReactDto>>countAndGetDisLikes(@PathVariable Long postId){
        return ResponseEntity.ok(reactService.countAndGetDisikes(postId));
    }
}

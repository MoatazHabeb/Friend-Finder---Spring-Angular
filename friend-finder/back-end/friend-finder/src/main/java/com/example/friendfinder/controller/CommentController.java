package com.example.friendfinder.controller;

import com.example.friendfinder.service.CommentService;
import com.example.friendfinder.service.dto.CommentDto;
import com.example.friendfinder.service.dto.CommentRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/savecomment")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CommentDto> saveComment(@RequestBody CommentRequestDto request){
        return ResponseEntity.ok(commentService.doComment(request));
    }
}

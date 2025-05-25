package com.example.friendfinder.service;


import com.example.friendfinder.service.dto.CommentDto;
import com.example.friendfinder.service.dto.CommentRequestDto;

public interface CommentService {
    CommentDto doComment(CommentRequestDto request);
}

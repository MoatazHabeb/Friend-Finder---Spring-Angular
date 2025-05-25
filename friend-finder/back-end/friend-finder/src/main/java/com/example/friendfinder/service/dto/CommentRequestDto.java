package com.example.friendfinder.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private String text;
    private Long postId;
}

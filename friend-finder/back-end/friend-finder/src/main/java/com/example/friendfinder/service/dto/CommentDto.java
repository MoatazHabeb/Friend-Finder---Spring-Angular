package com.example.friendfinder.service.dto;

import com.example.friendfinder.service.dto.jwt.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommentDto {
    private Long id;
    private String text;
    private UserDto user;
}

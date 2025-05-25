package com.example.friendfinder.service.dto;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.service.dto.jwt.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReactDto {
    private Long id;
    private boolean like;
    private boolean dislike;
    private UserDto user;

}

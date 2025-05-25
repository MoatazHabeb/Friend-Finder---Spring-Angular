package com.example.friendfinder.service.dto;

import com.example.friendfinder.model.Comment;
import com.example.friendfinder.model.React;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.jwt.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostDto {
    private long id;


    private String text;


    private String image;

    private String video;

    private List<CommentDto> commentList;
    private List<ReactDto> reacts;
    private UserDto users;
}
package com.example.friendfinder.controller.vm;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.PostDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponse {
    private List<UserDto> users;
    private List<PostDto> posts;
}

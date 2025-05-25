package com.example.friendfinder.service;

import com.example.friendfinder.service.dto.ReactDto;
import java.util.List;
public interface ReactService {

    ReactDto likePost(Long postId);
    ReactDto dislikePost(Long postId);

    List<ReactDto> countAndGetLikes(Long postId);

    List<ReactDto> countAndGetDisikes(Long postId);
}

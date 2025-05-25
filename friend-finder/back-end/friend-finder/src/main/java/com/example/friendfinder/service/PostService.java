package com.example.friendfinder.service;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.PostDto;
import com.example.friendfinder.controller.vm.SearchResponse;
import java.util.List;

public interface PostService {
    void savePost(Post post);

    List<PostDto> getAllPosts();
    List<PostDto> getMyAllPosts(Users users);
    Post getPostById(Long postId);

    List<PostDto> getPostesById(Long id);

    SearchResponse getPostOrUserByLetters(String letter);
}

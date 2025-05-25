package com.example.friendfinder.service.impl;

import com.example.friendfinder.controller.vm.SearchResponse;
import com.example.friendfinder.mapper.PostMapper;
import com.example.friendfinder.mapper.UserMapper;
import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.PostRepository;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.FriendService;
import com.example.friendfinder.service.PostService;

import com.example.friendfinder.service.dto.PostDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FriendService friendService;
    @Override
    public void savePost(Post post) {
            postRepository.save(post);
    }

    @Override
    public List<PostDto> getAllPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users currentUser = (Users) authentication.getPrincipal();

        List<Post> allPosts = postRepository.findAll();

        List<Post> filteredPosts = new ArrayList<>();

        for (Post post : allPosts) {
            Users postAuthor = post.getUser();

            if (postAuthor.getId().equals(currentUser.getId()) || friendService.isHeaFriend(currentUser, postAuthor.getId())) {
                filteredPosts.add(post);
            }
        }

        return PostMapper.POST_MAPPER.toDto(filteredPosts);
    }

    @Override
    public List<PostDto> getMyAllPosts(Users users) {
        List<Post> posts = postRepository.findByUser(users);
        List<PostDto> postDtos =PostMapper.POST_MAPPER.toDto(posts);
        return postDtos;
    }
    @Override
    public Post getPostById(Long postId){
        Optional<Post> optionalpost = postRepository.findById(postId);
        Post post = optionalpost.get();
        return post;
    }

    @Override
    public List<PostDto> getPostesById(Long id) {
        Optional<Users> optionalUsers = userRepository.findById(id);
        Users users = optionalUsers.get();
        List<Post> posts = postRepository.findByUser(users);

        return PostMapper.POST_MAPPER.toDto(posts);
    }

    @Override
    public SearchResponse getPostOrUserByLetters(String letter) {
        List<Users> users = userRepository.findByFullnameContainingIgnoreCase(letter);
        List<Post> posts = postRepository.findByTextContainingIgnoreCase(letter);
        List<UserDto> userDtoList = UserMapper.USER_MAPPER.toDtoList(users);
        List<PostDto> postDtoList = PostMapper.POST_MAPPER.toDto(posts);
        SearchResponse searchResponse = new SearchResponse(userDtoList,postDtoList);
        return searchResponse;
    }
}

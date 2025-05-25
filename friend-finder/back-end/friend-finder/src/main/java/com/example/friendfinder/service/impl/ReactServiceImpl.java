package com.example.friendfinder.service.impl;

import com.example.friendfinder.mapper.ReactMapper;
import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.React;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.ReactRepository;
import com.example.friendfinder.service.PostService;
import com.example.friendfinder.service.ReactService;
import com.example.friendfinder.service.dto.ReactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReactServiceImpl implements ReactService {
    @Autowired
    private ReactRepository reactRepository;
    @Autowired
    private PostService postService;

    @Override
    public ReactDto likePost(Long postId) {
        Post post = postService.getPostById(postId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        // Check if a React already exists for this user and post
        React existingReact = reactRepository.findByUserAndPost(user, post);

        if (existingReact != null) {
            // Toggle logic
            if (existingReact.isLike()) {
                existingReact.setLike(false); // unlike
            } else {
                existingReact.setLike(true);  // like
                existingReact.setDislike(false); // can't dislike and like at the same time
            }
            return ReactMapper.REACT_MAPPER.toDto(reactRepository.save(existingReact));
        }

        // New React
        React newReact = new React();
        newReact.setUser(user);
        newReact.setLike(true);
        newReact.setDislike(false);

        // Save to generate ID
        React savedReact = reactRepository.save(newReact);

        // Set bidirectional relationship
        post.getReacts().add(savedReact);
        savedReact.setPosts(new HashSet<>(List.of(post)));

        reactRepository.save(savedReact);

        return ReactMapper.REACT_MAPPER.toDto(savedReact);
    }
    @Override
    public ReactDto dislikePost(Long postId) {
        Post post = postService.getPostById(postId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        // Check if a React already exists for this user and post
        React existingReact = reactRepository.findByUserAndPost(user, post);

        if (existingReact != null) {
            // Toggle logic
            if (existingReact.isDislike()) {
                existingReact.setDislike(false); // remove dislike
            } else {
                existingReact.setDislike(true);  // dislike
                existingReact.setLike(false);   // can't like and dislike at the same time
            }
            return ReactMapper.REACT_MAPPER.toDto(reactRepository.save(existingReact));
        }

        // New React
        React newReact = new React();
        newReact.setUser(user);
        newReact.setLike(false);
        newReact.setDislike(true);

        // Save to generate ID
        React savedReact = reactRepository.save(newReact);

        // Set bidirectional relationship
        post.getReacts().add(savedReact);
        savedReact.setPosts(new HashSet<>(List.of(post)));

        reactRepository.save(savedReact);

        return ReactMapper.REACT_MAPPER.toDto(savedReact);
    }

    @Override
    public List<ReactDto> countAndGetLikes(Long postId) {
        return reactRepository.findByPostId(postId).stream()
                .filter(React::isLike)  // Only like reacts
                .map(ReactMapper.REACT_MAPPER::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReactDto> countAndGetDisikes(Long postId) {
        return reactRepository.findByPostId(postId).stream()
                .filter(React::isDislike)
                .map(ReactMapper.REACT_MAPPER::toDto)
                .collect(Collectors.toList());
    }


}

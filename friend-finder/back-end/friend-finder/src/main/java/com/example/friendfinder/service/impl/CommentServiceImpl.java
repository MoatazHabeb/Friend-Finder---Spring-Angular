package com.example.friendfinder.service.impl;

import com.example.friendfinder.mapper.CommentMapper;
import com.example.friendfinder.model.Comment;
import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.CommentRepository;
import com.example.friendfinder.service.CommentService;
import com.example.friendfinder.service.PostService;
import com.example.friendfinder.service.dto.CommentDto;
import com.example.friendfinder.service.dto.CommentRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostService postService;
    @Override
    public CommentDto doComment(CommentRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users users = (Users) authentication.getPrincipal();
        Post post =postService.getPostById(request.getPostId());
        Comment comment = new Comment();
        comment.setUser(users);
        comment.setPost(post);
        comment.setText(request.getText());
        Comment savedComment = commentRepository.save(comment);

        return CommentMapper.COMMENT_MAPPER.toDto(savedComment);
    }
}

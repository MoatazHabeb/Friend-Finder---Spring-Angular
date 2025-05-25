package com.example.friendfinder.mapper;

import com.example.friendfinder.model.Comment;
import com.example.friendfinder.service.dto.CommentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CommentMapper {
    CommentMapper COMMENT_MAPPER = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "user", target = "user")
    CommentDto toDto(Comment comment);

    List<CommentDto> toDto(List<Comment> comments);

    @Mapping(source = "user", target = "user")
    Comment toEntity(CommentDto commentDto);

    List<Comment> toEntity(List<CommentDto> commentDtos);
}

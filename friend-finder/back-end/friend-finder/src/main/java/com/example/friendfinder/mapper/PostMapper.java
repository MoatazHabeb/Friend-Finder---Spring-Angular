package com.example.friendfinder.mapper;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.service.dto.PostDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface PostMapper {
    PostMapper POST_MAPPER = Mappers.getMapper(PostMapper.class);

    Post toEntity(PostDto postDto);

    List<Post> toEntity(List<PostDto> postDtos);

    @Mapping(source = "user", target = "users")
    @Mapping(source = "comments", target = "commentList")
    @Mapping(source = "reacts", target = "reacts")
    PostDto toDto(Post post);

    List<PostDto> toDto(List<Post> posts);
}
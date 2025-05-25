package com.example.friendfinder.mapper;

import com.example.friendfinder.model.React;
import com.example.friendfinder.service.dto.ReactDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ReactMapper {
    ReactMapper REACT_MAPPER = Mappers.getMapper(ReactMapper.class);

    @Mapping(source = "user", target = "user")
    ReactDto toDto(React react);

    List<ReactDto> toDto(List<React> reacts);

    @Mapping(source = "user", target = "user")
    React toEntity(ReactDto reactDto);

    List<React> toEntity(List<ReactDto> reactDtos);
}

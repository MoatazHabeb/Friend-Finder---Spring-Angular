package com.example.friendfinder.mapper;

import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.model.userdetails.UserDetails;
import com.example.friendfinder.service.dto.UserDetailsDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UserDetailsMapper {
    UserDetailsMapper USER_DETAILS_MAPPER = Mappers.getMapper(UserDetailsMapper.class);

    UserDetails toEntity(UserDetailsDto userDetailsDto);
    List<UserDetails> toEntityList(List<UserDetailsDto> userDetailsDtoList);


    UserDetailsDto toDto(UserDetails userDetails);
    List<UserDetailsDto> toDtoList( List<UserDetails> userDetailsList);
}

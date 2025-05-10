package com.example.friendfinder.mapper;

import com.example.friendfinder.model.Contact;
import com.example.friendfinder.service.dto.ContactDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ContactMapper {
    ContactMapper CONTACT_MAPPER = Mappers.getMapper(ContactMapper.class);


    Contact toEntity(ContactDto contactInfoDto);

    List<Contact> toEntity(List<ContactDto> contactInfoDtos);


    ContactDto toDto(Contact contactInfo);

    List<ContactDto> toDto(List<Contact> contactInfos);
}

package com.example.friendfinder.service.impl;

import com.example.friendfinder.mapper.ContactMapper;
import com.example.friendfinder.model.Contact;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.ContactRepository;
import com.example.friendfinder.service.ContactService;
import com.example.friendfinder.service.dto.ContactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;
    @Override
    public ContactDto saveMessage(ContactDto contactDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users users = (Users) authentication.getPrincipal();

        // Map to entity
        Contact contact = ContactMapper.CONTACT_MAPPER.toEntity(contactDto);
        contact.setUsers(users);


        // Save
        Contact savedContact = contactRepository.save(contact);


        return ContactMapper.CONTACT_MAPPER.toDto(savedContact);
    }
}

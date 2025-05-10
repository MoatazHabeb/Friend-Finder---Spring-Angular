package com.example.friendfinder.controller;

import com.example.friendfinder.service.ContactService;
import com.example.friendfinder.service.dto.ContactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Contact")
public class ContactController {

    @Autowired
    private ContactService contactService;


    @PostMapping("/saveMessage")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ContactDto> saveMessage(@RequestBody ContactDto contactDto) {


        ContactDto savedContact = contactService.saveMessage(contactDto);
        return ResponseEntity.ok(savedContact);
    }
}

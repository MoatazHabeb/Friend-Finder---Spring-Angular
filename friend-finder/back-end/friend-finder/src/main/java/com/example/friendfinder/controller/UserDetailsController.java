package com.example.friendfinder.controller;

import com.example.friendfinder.service.UserDetailsService;
import com.example.friendfinder.service.dto.UserDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/UserDetails")
public class UserDetailsController {
    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/saveUserDetails")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDetailsDto> saveUserDetails(@RequestBody UserDetailsDto userDetailsDto){
        UserDetailsDto userDetailsDto1= userDetailsService.saveUserDetails(userDetailsDto);
        return ResponseEntity.ok(userDetailsDto1);
    }
    @GetMapping("/getUserDetails")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDetailsDto> getUserDetails(){
        UserDetailsDto userDetailsDto = userDetailsService.getUserDetails();
        return ResponseEntity.ok(userDetailsDto);
    }

    @GetMapping("/getUserDetailsById/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDetailsDto> getUserDetailsById(@PathVariable Long id){
        UserDetailsDto userDetailsDto = userDetailsService.getUserDetailsById(id);
        return ResponseEntity.ok(userDetailsDto);
    }
}

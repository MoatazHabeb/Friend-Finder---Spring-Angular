package com.example.friendfinder.service;

import com.example.friendfinder.service.dto.UserDetailsDto;

public interface UserDetailsService {
    UserDetailsDto saveUserDetails(UserDetailsDto userDetailsDto);
    UserDetailsDto getUserDetails();
    UserDetailsDto getUserDetailsById(Long id);
}

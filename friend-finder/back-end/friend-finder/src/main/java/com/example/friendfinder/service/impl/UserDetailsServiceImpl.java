package com.example.friendfinder.service.impl;

import com.example.friendfinder.mapper.UserDetailsMapper;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.model.userdetails.Language;
import com.example.friendfinder.model.userdetails.UserDetails;
import com.example.friendfinder.repo.LanguageRepository;
import com.example.friendfinder.repo.UserDetailsRepository;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.UserDetailsService;
import com.example.friendfinder.service.dto.UserDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserDetailsRepository userDetailsRepository;
    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetailsDto saveUserDetails(UserDetailsDto userDetailsDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users users = (Users) authentication.getPrincipal();

        UserDetails userDetails;
        if (userDetailsRepository.existsByUser(users)) {
            // Fetch existing details and update fields
            userDetails = userDetailsRepository.findByUser(users);
            UserDetails updatedDetails = UserDetailsMapper.USER_DETAILS_MAPPER.toEntity(userDetailsDto);

            // Update basic fields
            userDetails.setWork(updatedDetails.getWork());
            userDetails.setCity(updatedDetails.getCity());
            userDetails.setRelationship(updatedDetails.getRelationship());
            userDetails.setHighSchool(updatedDetails.getHighSchool());
            userDetails.setCollege(updatedDetails.getCollege());
            userDetails.setBio(updatedDetails.getBio());
            userDetails.setBirthday(updatedDetails.getBirthday());

            // Update languages (clear + addAll + set parent)
            userDetails.getLanguages().clear();
            updatedDetails.getLanguages().forEach(lang -> lang.setUserDetails(userDetails));
            userDetails.getLanguages().addAll(updatedDetails.getLanguages());

            // Update interests (clear + addAll + set parent)
            userDetails.getInterests().clear();
            updatedDetails.getInterests().forEach(interest -> interest.setUserDetails(userDetails));
            userDetails.getInterests().addAll(updatedDetails.getInterests());

        } else {
            // Insert new
            userDetails = UserDetailsMapper.USER_DETAILS_MAPPER.toEntity(userDetailsDto);
            userDetails.setUser(users);

            userDetails.getLanguages().forEach(lang -> lang.setUserDetails(userDetails));
            userDetails.getInterests().forEach(interest -> interest.setUserDetails(userDetails));
        }

        UserDetails saved = userDetailsRepository.save(userDetails);
        return UserDetailsMapper.USER_DETAILS_MAPPER.toDto(saved);
    }

    @Override
    public UserDetailsDto getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users users = (Users) authentication.getPrincipal();
        UserDetails userDetails = userDetailsRepository.findByUser(users);

        return UserDetailsMapper.USER_DETAILS_MAPPER.toDto(userDetails);
    }

    @Override
    public UserDetailsDto getUserDetailsById(Long id) {
        Optional<Users> optionalUsers = userRepository.findById(id);
        Users user = optionalUsers.get();
        UserDetails userDetails = userDetailsRepository.findByUser(user);


        return UserDetailsMapper.USER_DETAILS_MAPPER.toDto(userDetails);
    }

}

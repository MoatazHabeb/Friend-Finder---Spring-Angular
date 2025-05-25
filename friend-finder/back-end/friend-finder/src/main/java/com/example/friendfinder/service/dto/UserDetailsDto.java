package com.example.friendfinder.service.dto;

import com.example.friendfinder.model.userdetails.Interests;
import com.example.friendfinder.model.userdetails.Language;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDto {
    private String work;
    private String city;
    private String relationship;
    private String highSchool;
    private String college;
    private String bio;
    private String birthday;
    private List<Language> languages;
    private List<Interests> interests;
}

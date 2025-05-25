package com.example.friendfinder.model.userdetails;

import com.example.friendfinder.model.Contact;
import com.example.friendfinder.model.clientmodel.Users;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String work;
    private String city;
    private String relationship;
    private String highSchool;
    private String college;
    private String bio;
    private String birthday;

    @OneToMany(mappedBy = "userDetails", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<Language> languages;

    @OneToMany(mappedBy = "userDetails", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<Interests> interests;

    @OneToOne
    private Users user;
}

package com.example.friendfinder.model.clientmodel;

import com.example.friendfinder.enums.Gender;
import com.example.friendfinder.model.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class Users extends UserBaseEntity {



    @NotEmpty(message = "requried")
    @Pattern(regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/="
            + "?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f"
            + "]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]"
            + "*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x"
            + "21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",message = "Invalid Email")
    private String email;

    @NotEmpty(message = "requried")
    @Size(min = 8,message = "Must Be 8 digits or more")
    private String password;

    private int active;

    @NotEmpty(message = "requried")
    private String fullname;

    @NotEmpty(message = "requried")
    @Pattern(regexp = "^(0|[1-9][0-9]*)$",message = "must include only number")
    private String age;

    @Enumerated(value = EnumType.STRING)
    @NotNull(message = "requried")
    private Gender gender;

    private String image;
    //private String logoPath;

//    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
//    private List<Orders> requestOrders;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "roles_id"))
    private List<Roles> roles;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "user")
    private Set<Post> posts;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "user")
    private Set<Comment> comments;



    @OneToMany(fetch = FetchType.LAZY,mappedBy = "user")
    private Set<React> reacts;


    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
    private List<Contact> contact;


    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private Set<Friend> sentFriendRequests;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private Set<Friend> receivedFriendRequests;






}

package com.example.friendfinder.model;

import com.example.friendfinder.model.clientmodel.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private String text;


    private String image;

    private String video;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users user;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "post")
    @JsonIgnore
    private Set<Comment> comments;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "post_reacts",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "react_id")
    )
    private Set<React> reacts;
}

package com.example.friendfinder.model;

import com.example.friendfinder.model.clientmodel.Users;
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




    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private Users user;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "post")
    private Set<Comment> comments;

    @ManyToMany
    @JoinTable(
            name = "post_reacts",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "react_id")
    )
    private Set<React> reacts;
}

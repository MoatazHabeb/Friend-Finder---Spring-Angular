package com.example.friendfinder.model;

import com.example.friendfinder.model.clientmodel.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
public class React {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int like;
    private int dislike;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToMany(mappedBy = "reacts")
    private Set<Post> posts;

    @ManyToMany(mappedBy = "reacts")
    private Set<Comment> comments ;
}

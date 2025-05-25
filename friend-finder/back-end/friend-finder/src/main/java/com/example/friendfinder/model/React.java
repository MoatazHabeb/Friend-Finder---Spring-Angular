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
public class React {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "\"like\"")
    private boolean like;

    @Column(name = "\"dislike\"")
    private boolean dislike;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users user;

    @ManyToMany(mappedBy = "reacts")
    @JsonIgnore
    private Set<Post> posts;

    @ManyToMany(mappedBy = "reacts")
    @JsonIgnore
    private Set<Comment> comments ;
}

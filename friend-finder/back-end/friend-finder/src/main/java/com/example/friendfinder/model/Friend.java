package com.example.friendfinder.model;

import com.example.friendfinder.model.clientmodel.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // Who sent the friend request
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private Users sender;

    // Who received the friend request
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Users receiver;

    // Whether the request has been accepted
    private boolean accepted = false;

    private String createdAt = java.time.LocalDateTime.now().toString();

}

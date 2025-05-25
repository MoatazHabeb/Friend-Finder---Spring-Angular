package com.example.friendfinder.model.userdetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String language;
    @ManyToOne
    @JoinColumn(name ="UserDetails_id")
    @JsonIgnore
    private UserDetails userDetails;


}

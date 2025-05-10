package com.example.friendfinder.model.clientmodel;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Entity
@Getter
@Setter
public class Roles extends UserBaseEntity{
    private String code;

    @ManyToMany(mappedBy = "roles")
    private List<Users> users;
}

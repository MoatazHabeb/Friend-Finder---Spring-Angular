package com.example.friendfinder.repo.jwt;

import com.example.friendfinder.model.clientmodel.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {
    Roles findByCode(String code);
}

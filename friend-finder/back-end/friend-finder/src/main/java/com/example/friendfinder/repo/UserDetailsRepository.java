package com.example.friendfinder.repo;

import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.model.userdetails.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails,Long> {
    boolean existsByUser (Users users);
    UserDetails findByUser(Users users); // Add this line
}

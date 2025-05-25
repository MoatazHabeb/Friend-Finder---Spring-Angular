package com.example.friendfinder.repo.jwt;

import com.example.friendfinder.model.clientmodel.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
    List<Users> findByActiveTrue();
    @Query("SELECT u FROM Users u WHERE u.id <> :userId AND u.id NOT IN (" +
            "SELECT CASE WHEN f.sender.id = :userId THEN f.receiver.id ELSE f.sender.id END " +
            "FROM Friend f WHERE (f.sender.id = :userId OR f.receiver.id = :userId))")
    List<Users> findUsersNotFriendsWith(@Param("userId") Long userId);
    List<Users> findByFullnameContainingIgnoreCase(String fullname);
}

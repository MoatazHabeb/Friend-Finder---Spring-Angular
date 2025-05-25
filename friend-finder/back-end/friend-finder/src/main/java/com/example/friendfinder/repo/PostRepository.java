package com.example.friendfinder.repo;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post,Long> {
    List<Post> findByUser(Users users);
    List<Post> findByTextContainingIgnoreCase(String text);
}

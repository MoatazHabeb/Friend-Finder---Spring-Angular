package com.example.friendfinder.repo;

import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.React;
import com.example.friendfinder.model.clientmodel.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactRepository extends JpaRepository<React,Long> {
    @Query("SELECT r FROM React r JOIN r.posts p WHERE r.user = :user AND p = :post")
    React findByUserAndPost(@Param("user") Users user, @Param("post") Post post);

    @Query("SELECT r FROM React r JOIN r.posts p WHERE p.id = :postId")
    List<React> findByPostId(@Param("postId") Long postId);
}

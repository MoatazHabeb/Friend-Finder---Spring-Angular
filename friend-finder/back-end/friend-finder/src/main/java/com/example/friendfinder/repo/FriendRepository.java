package com.example.friendfinder.repo;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend,Long> {
    Optional<Friend> findBySenderAndReceiver(Users sender, Users receiver);
    List<Friend> findByReceiverAndAcceptedFalse(Users receiver);
    List<Friend> findBySenderOrReceiverAndAcceptedTrue(Users user1, Users user2);
}

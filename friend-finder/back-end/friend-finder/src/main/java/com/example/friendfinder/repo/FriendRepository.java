package com.example.friendfinder.repo;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend,Long> {
    Optional<Friend> findBySenderAndReceiver(Users sender, Users receiver);
    List<Friend> findByReceiverAndAcceptedFalse(Users receiver);
    List<Friend> findBySenderOrReceiverAndAcceptedTrue(Users user1, Users user2);
    @Query("SELECT f FROM Friend f WHERE f.accepted = true AND (f.sender = :user OR f.receiver = :user)")
    List<Friend> findAcceptedFriendsByUser(@Param("user") Users user);

    Friend findBySenderAndReceiverAndAcceptedFalse(Users sender, Users receiver);

    Optional<Friend> findBySenderAndReceiverAndAcceptedTrue(Users sender, Users receiver);
    // Or a count query to return boolean via exists
    @Query("SELECT COUNT(f) > 0 FROM Friend f WHERE f.sender = :sender AND f.receiver = :receiver AND f.accepted = true")
    boolean existsBySenderAndReceiverAndAcceptedTrue(@Param("sender") Users sender, @Param("receiver") Users receiver);
}

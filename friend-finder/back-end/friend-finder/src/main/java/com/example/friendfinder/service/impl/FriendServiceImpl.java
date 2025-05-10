package com.example.friendfinder.service.impl;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.FriendRepository;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendServiceImpl implements FriendService {
    @Autowired
     private UserRepository userRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Override
    public void sendFriendRequest(Long senderId, Long receiverId) {
        Users sender = userRepository.findById(senderId).orElseThrow();
        Users receiver = userRepository.findById(receiverId).orElseThrow();

        if (friendRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Friend request already sent");
        }

        Friend request = new Friend();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setAccepted(false);

        friendRepository.save(request);
    }
    @Override
    public void acceptFriendRequest(Long requestId, Long receiverId) {
        Friend request = friendRepository.findById(requestId).orElseThrow();

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Unauthorized to accept this request");
        }

        request.setAccepted(true);
        friendRepository.save(request);
    }

    @Override
    public List<Friend> getPendingRequests(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();
        return friendRepository.findByReceiverAndAcceptedFalse(user);
    }
    @Override
    public List<Friend> getFriends(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();
        return friendRepository.findBySenderOrReceiverAndAcceptedTrue(user, user);
    }

}

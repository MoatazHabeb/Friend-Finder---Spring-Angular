package com.example.friendfinder.service.impl;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.repo.FriendRepository;
import com.example.friendfinder.repo.jwt.UserRepository;
import com.example.friendfinder.service.FriendService;
import com.example.friendfinder.service.dto.FriendUserDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Transactional
    public void acceptFriendRequest(Long senderId, Long receiverId) {
        Users sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with ID: " + senderId));

        Users receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with ID: " + receiverId));

        Friend request = friendRepository.findBySenderAndReceiverAndAcceptedFalse(sender, receiver);

        request.setAccepted(true);
        friendRepository.save(request);
    }

    @Override
    public List<FriendUserDto> getPendingRequests(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();
        List<Friend> pendingRequests = friendRepository.findByReceiverAndAcceptedFalse(user);

        return pendingRequests.stream()
                .map(friend -> {
                    Users sender = friend.getSender();
                    return new FriendUserDto(sender.getId(), sender.getFullname(), sender.getImage());
                })
                .toList();
    }
    @Override
    public List<FriendUserDto> getFriends(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();

        List<Friend> acceptedFriends = friendRepository.findAcceptedFriendsByUser(user);

        return acceptedFriends.stream()
                .map(friend -> {
                    Users friendUser = friend.getSender().getId().equals(userId)
                            ? friend.getReceiver()
                            : friend.getSender();

                    return new FriendUserDto(
                            friendUser.getId(),
                            friendUser.getFullname(),
                            friendUser.getImage()
                    );
                })
                .distinct()
                .collect(Collectors.toList());
    }
    @Override
    public Long countFriends(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();

        List<Friend> acceptedFriends = friendRepository.findAcceptedFriendsByUser(user);

        return acceptedFriends.stream()
                .map(friend -> friend.getSender().getId().equals(userId)
                        ? friend.getReceiver().getId()
                        : friend.getSender().getId())
                .distinct()
                .count();
    }

    @Override
    public boolean isHeaFriend(Users userss, Long receiverid) {
        Optional<Users> receiverusers = userRepository.findById(receiverid);
        if (receiverusers.isEmpty()) {
            return false;
        }
        Users rusers = receiverusers.get();

        return friendRepository.existsBySenderAndReceiverAndAcceptedTrue(userss, rusers) || friendRepository.existsBySenderAndReceiverAndAcceptedTrue(rusers,userss) ;
    }


}

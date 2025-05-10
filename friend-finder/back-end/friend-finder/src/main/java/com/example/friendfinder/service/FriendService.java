package com.example.friendfinder.service;

import com.example.friendfinder.model.Friend;

import java.util.List;

public interface FriendService {
    void sendFriendRequest(Long senderId, Long receiverId);
    void acceptFriendRequest(Long requestId, Long receiverId);
    List<Friend> getPendingRequests(Long userId);
    List<Friend> getFriends(Long userId);
}

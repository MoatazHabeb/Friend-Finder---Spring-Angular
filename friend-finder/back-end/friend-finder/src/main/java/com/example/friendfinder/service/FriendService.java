package com.example.friendfinder.service;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.dto.FriendUserDto;
import com.example.friendfinder.service.dto.jwt.UserDto;

import java.util.List;

public interface FriendService {
    void sendFriendRequest(Long senderId, Long receiverId);
    void acceptFriendRequest(Long requestId, Long receiverId);
    List<FriendUserDto> getPendingRequests(Long userId);
    List<FriendUserDto> getFriends(Long userId);
    Long countFriends(Long userId);
    boolean isHeaFriend(Users userss,Long receiverid);
}

package com.example.friendfinder.controller;

import com.example.friendfinder.model.Friend;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.FriendService;
import com.example.friendfinder.service.dto.FriendUserDto;
import com.example.friendfinder.service.dto.jwt.UserDto;
import com.example.friendfinder.service.jwt.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;
    @Autowired
    private UserService userService;
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<FriendUserDto>> getPendingRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        return ResponseEntity.ok(friendService.getPendingRequests(user.getId()));
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<FriendUserDto>> getFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users usersss = (Users) authentication.getPrincipal();

        return ResponseEntity.ok(friendService.getFriends(usersss.getId()));
    }

    @GetMapping("/getFriendsById/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<FriendUserDto>> getFriendsById(@PathVariable Long id) {


        return ResponseEntity.ok(friendService.getFriends(id));
    }
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Long> countFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users usersss = (Users) authentication.getPrincipal();

        return ResponseEntity.ok(friendService.countFriends(usersss.getId()));
    }
    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> sendFriendRequest(@RequestParam Long receiverId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users usersss = (Users) authentication.getPrincipal();
        Long senderId = usersss.getId();
        friendService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/accept/{senderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable Long senderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users receiver = (Users) authentication.getPrincipal();
        friendService.acceptFriendRequest(senderId, receiver.getId());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/not-friends")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<UserDto>> getNonFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users userss = (Users) authentication.getPrincipal();
        Long userId =userss.getId();
        List<Users> users = userService.getUsersNotFriendsWith(userId);
        List<UserDto> dtoList = users.stream()
                .map(user -> new UserDto(user.getId(), user.getFullname(), user.getImage()))
                .toList();
        return ResponseEntity.ok(dtoList);
    }
    @GetMapping("/isHeaFriend/{receiverid}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Boolean> isHeaFriend(@PathVariable Long receiverid){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users userss = (Users) authentication.getPrincipal();
        if(receiverid == userss.getId()){
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(friendService.isHeaFriend(userss,receiverid));
    }
}

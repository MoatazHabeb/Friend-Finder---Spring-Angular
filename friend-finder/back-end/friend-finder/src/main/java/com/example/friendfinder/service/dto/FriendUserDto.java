package com.example.friendfinder.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendUserDto {
    private Long id;
    private String fullname;
    private String image;
}

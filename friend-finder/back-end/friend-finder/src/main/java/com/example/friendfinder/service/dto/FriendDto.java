package com.example.friendfinder.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendDto {
    private Long id;
    private String name;
    private String image;
}

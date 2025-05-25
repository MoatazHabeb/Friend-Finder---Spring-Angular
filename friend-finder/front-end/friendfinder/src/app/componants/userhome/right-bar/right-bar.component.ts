import { Component, OnInit } from '@angular/core';
import {FriendService, UserDTO} from "../../../../service/friend.service";

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {
  nonFriends: UserDTO[] = [];
  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadNonFriends()
  }
  loadNonFriends(): void {
    this.friendService.getNonFriends().subscribe({
      next: (users) => this.nonFriends = users,
      error: (err) => console.error('Failed to load non-friends', err)
    });
  }
  sendRequest(receiverId: number): void {
    this.friendService.sendFriendRequest(receiverId).subscribe({
      next: () => {
        this.nonFriends = this.nonFriends.filter(u => u.id !== receiverId);
        alert('Friend request sent!');
      },
      error: (err) => console.error('Failed to send request', err)
    });
  }
}

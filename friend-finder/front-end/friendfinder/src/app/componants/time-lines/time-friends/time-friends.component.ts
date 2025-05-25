import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FriendDTO, FriendService, UserDTO } from "../../../../service/friend.service";

type Tab = 'friends' | 'find' | 'requests';

@Component({
  selector: 'app-time-friends',
  templateUrl: './time-friends.component.html',
  styleUrls: ['./time-friends.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TimeFriendsComponent implements OnInit {
  myFriends: UserDTO[] = [];
  nonFriends: UserDTO[] = [];
  pendingRequests: UserDTO[] = [];



  activeTab: Tab = 'friends';

  constructor(private friendService: FriendService) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  switchTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'friends') {
      this.loadFriends();
    } else if (tab === 'find') {
      this.loadNonFriends();
    } else if (tab === 'requests') {
      this.loadPendingRequests();
    }
  }

  loadFriends(): void {
    this.friendService.getFriends().subscribe({
      next: (data) => this.myFriends = data,
      error: (err) => console.error('Failed to load friends', err)
    });
  }

  loadNonFriends(): void {
    this.friendService.getNonFriends().subscribe({
      next: (users) => this.nonFriends = users,
      error: (err) => console.error('Failed to load non-friends', err)
    });
  }

  loadPendingRequests(): void {
    this.friendService.getPendingRequests().subscribe({
      next: (data) => this.pendingRequests = data,
      error: (err) => console.error('Failed to load pending requests', err)
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

  acceptRequest(senderId: number): void {
    this.friendService.acceptFriendRequest(senderId).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(u => u.id !== senderId);
        this.loadFriends(); // Refresh friend list
        alert('Friend request accepted!');
      },
      error: (err) => console.error('Failed to accept friend request', err)
    });
  }
}

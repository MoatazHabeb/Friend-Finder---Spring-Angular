import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PostService} from "../../../../service/post.service";
import {ProfileService} from "../../../../service/profile.service";
import {FriendService} from "../../../../service/friend.service";
import {AuthService} from "../../../../service/auth/auth.service";
import {UserDto} from "../../../../model/user-dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  onlineUsers: UserDto[] = [];
  user: any;
  friendCount: number = 0;
  constructor(
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
  private friendService: FriendService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadFriendCount();
    this.authService.getOnlineUsers().subscribe(users => {
      this.onlineUsers = users;
    });
  }


  loadProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }
  loadFriendCount(): void {
    this.friendService.getFriendCount().subscribe({
      next: (count) => {
        this.friendCount = count;
        this.cd.detectChanges(); // force immediate update
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendService, FriendUserDto } from "../../../../service/friend.service";
import { TokenStorageService } from "../../../../service/token-storage.service";
import { ProfileService } from "../../../../service/profile.service";
import { Users } from "../../../../service/post.service";

@Component({
  selector: 'app-friend-friends',
  templateUrl: './friend-friends.component.html',
  styleUrls: ['./friend-friends.component.css']
})
export class FriendFriendsComponent implements OnInit {
  userId!: number;
  friends: FriendUserDto[] = [];
  user2: Users | null = null;

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.userId = +idParam;

        // First load profile
        this.profileService.getUserProfile().subscribe({
          next: (user) => {
            this.user2 = user;

            // Now compare and redirect if needed
            if (this.user2 && this.user2.id === this.userId) {
              this.router.navigate(['/timelinerofile']);
            } else {
              this.loadFriends(this.userId);
            }
          },
          error: (err) => console.error('Error loading profile:', err)
        });
      }
    });
  }

  loadFriends(id: number): void {
    this.friendService.getFriendsById(id).subscribe({
      next: (data) => this.friends = data,
      error: (err) => console.error('Failed to load friends', err)
    });
  }
}

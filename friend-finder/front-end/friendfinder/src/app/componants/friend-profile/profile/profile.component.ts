import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from "../../../../service/post.service";
import { ProfileService } from "../../../../service/profile.service";
import {FriendService} from "../../../../service/friend.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number;
  user: Users | null = null;
  isFriend = false;
  constructor(
    private route: ActivatedRoute,
    private userService: ProfileService,
    private router: Router,
  private friendService: FriendService,
  private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.checkIfFriend(this.userId);
      if (id) {
        this.userId = +id;

        // Get logged-in user's profile
        this.userService.getUserProfile().subscribe({
          next: (loggedInUser) => {
            if (loggedInUser.id === this.userId) {
              // Redirect if viewing own profile
              this.router.navigate(['/timelinerofile']);
            } else {
              this.loadUser(this.userId);
            }
          },
          error: (err) => console.error('Failed to fetch logged-in user:', err)
        });
      }
    });
  }

  checkIfFriend(receiverId: number): void {
    this.friendService.isHeaFriend(receiverId).subscribe({
      next: (isFriend) => {
        this.isFriend = isFriend;
        this.cd.detectChanges();
      },
      error: () => this.isFriend = false
    });
  }
  loadUser(id: number): void {
    this.userService.getUserProfileById(id).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    });
  }
}

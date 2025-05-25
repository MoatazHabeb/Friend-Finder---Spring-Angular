import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UserDetailsDto, UserDetailsService} from "../../../../service/user-details.service";
// @ts-ignore
import {join} from "node:path";



@Component({
  selector: 'app-friend-about',
  templateUrl: './friend-about.component.html',
  styleUrls: ['./friend-about.component.css']
})
export class FriendAboutComponent implements OnInit {
  userId!: number;
  userDetails!: UserDetailsDto;

  constructor(
    private route: ActivatedRoute,
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      console.log(idParam);
      if (idParam) {
        this.userId = +idParam;
        this.loadUserDetails();
        console.log(this.userId);
      }
    });
  }

  languagesList: string = '';
  interestsList: string = '';

  loadUserDetails(): void {
    this.userDetailsService.getUserDetailsById(this.userId).subscribe({
      next: (details) => {
        this.userDetails = details;
        this.languagesList = details.languages?.map(l => l.language).join(', ') || 'None';
        this.interestsList = details.interests?.map(i => i.interest).join(', ') || 'None';
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

}

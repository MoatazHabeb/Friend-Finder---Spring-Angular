import { Component, OnInit } from '@angular/core';
import { PostService } from "../../../../service/post.service";
import { ProfileService } from "../../../../service/profile.service";

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  postText: string = '';
  selectedFile: File | null = null;
  user: any;

  constructor(
    private postService: PostService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const fileType = this.selectedFile.type;

      if (fileType.startsWith('image')) {
        alert("Photo uploaded successfully ✅");
      } else if (fileType.startsWith('video')) {
        alert("Video uploaded successfully ✅");
      } else {
        alert("Unsupported file type ❌");
        this.selectedFile = null;
      }

      console.log('Selected file:', this.selectedFile);
    }
  }

  onPublish(): void {
    if (!this.selectedFile || !this.postText) {
      alert("Please provide both a file and some text.");
      return;
    }

    this.postService.uploadPost(this.selectedFile, this.postText).subscribe({
      next: (response) => {
        console.log("Upload successful", response);
        alert("Uploaded Successfully ✅");

        this.postText = '';
        this.selectedFile = null;
      },
      error: (err) => {
        console.error("Upload failed", err);
        alert("Upload failed ❌");
      }
    });
  }
}

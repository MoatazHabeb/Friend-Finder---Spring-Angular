import {ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { ProfileService } from "../../../../service/profile.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-line-profile',
  templateUrl: './time-line-profile.component.html',
  styleUrls: ['./time-line-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLineProfileComponent implements OnInit, OnDestroy {
  user: any;
  followerCount = 0;
  isLoading = false;
  uploadMessage = '';
  private subscriptions: Subscription[] = [];
  imageUrl: string = '';
  defaultImageUrl: string = 'assets/default-profile.png';

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  loadProfile(): void {
    if (this.isLoading) return;

    this.isLoading = true;

    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.imageUrl = this.getFullImageUrl(user?.image);
        this.cd.detectChanges();  // <- manually trigger view update
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.imageUrl = this.defaultImageUrl;
        this.cd.detectChanges();
        this.isLoading = false;
      }
    });
  }

  private getFullImageUrl(imagePath: string | null | undefined, bustCache = false): string {
    if (!imagePath) {
      return this.defaultImageUrl;
    }

    // If already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Build full URL for relative image paths
    const fullUrl = `http://localhost:4050${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return bustCache ? `${fullUrl}?t=${Date.now()}` : fullUrl;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.upload(); // Automatically upload after selecting
    }
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);

    }
  }

  upload(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.uploadMessage = 'Uploading...';
    this.isLoading = true;

    this.http.post<any>('http://localhost:4050/user/upload-profile-image', formData).subscribe({
      next: (response) => {
        this.uploadMessage = 'Upload successful!';
        this.previewUrl = null;
        this.selectedFile = null;
        this.loadProfile(); // Refresh to get the new image
        window.location.reload(); // ✅ Reload the full page
      },
      error: (err: HttpErrorResponse) => {
        this.uploadMessage = 'Upload failed: ' + this.getErrorMessage(err);
        this.isLoading = false;
      }
    });
  }



  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 200) return 'Upload successful!';
    if (error.error instanceof ErrorEvent) return `Client error: ${error.error.message}`;
    return `Server error: ${error.status} - ${error.error?.message || error.statusText}`;
  }
}

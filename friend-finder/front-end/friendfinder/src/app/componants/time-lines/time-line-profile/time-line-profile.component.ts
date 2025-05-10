import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from "../../../../service/profile.service";
import { HttpClient, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-line-profile',
  templateUrl: './time-line-profile.component.html',
  styleUrls: ['./time-line-profile.component.css']
})
export class TimeLineProfileComponent implements OnInit, OnDestroy {
  user: any = null;
  followerCount = 0;
  isLoading = false;
  uploadMessage = '';
  uploadProgress = 0;
  private subscriptions: Subscription[] = [];
  imageUrl: string = '';
  defaultImageUrl: string = 'assets/default-profile.png';
  photoTimestamp: number = Date.now(); // Used to force image refresh

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProfile(): void {
    this.isLoading = true;
    const sub = this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        // Extract follower count if it exists in the response
        this.followerCount = data.followerCount || 0;
        this.updateImageUrl();
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }
    });
    this.subscriptions.push(sub);
  }

  updateImageUrl(): void {
    this.photoTimestamp = Date.now(); // Update timestamp to force reload
    this.imageUrl = this.getImageUrl();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      this.uploadMessage = 'Please select a valid image file (JPEG or PNG)';
      setTimeout(() => this.uploadMessage = '', 3000);
      return;
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.uploadMessage = 'File is too large. Please select an image less than 5MB';
      setTimeout(() => this.uploadMessage = '', 3000);
      return;
    }

    this.isLoading = true;
    this.uploadMessage = 'Uploading...';
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', file);

    const sub = this.profileService.uploadProfilePhoto(formData).subscribe({
      next: (event: any) => {
        // Track upload progress if using observe: 'events'
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          this.changeDetector.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          // Upload completed
          this.uploadMessage = 'Upload successful!';
          this.uploadProgress = 100;

          // Force reload image with cache busting
          setTimeout(() => {
            this.loadProfile();
          }, 500);
        }
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.uploadMessage = this.getErrorMessage(err);
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        setTimeout(() => {
          this.uploadMessage = '';
          this.uploadProgress = 0;
          this.changeDetector.detectChanges();
        }, 3000);
      }
    });
    this.subscriptions.push(sub);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImageUrl;
    this.changeDetector.detectChanges();
  }

  getImageUrl(): string {
    if (!this.user || !this.user.image) {
      return this.defaultImageUrl;
    }

    // Check if image is already a complete URL
    if (this.user.image.startsWith('http')) {
      return `${this.user.image}?t=${this.photoTimestamp}`; // Add timestamp to prevent caching
    }

    // Check if image path includes the '/profile-images/' prefix
    if (this.user.image.startsWith('/profile-images/')) {
      return `http://localhost:4040${this.user.image}?t=${this.photoTimestamp}`;
    }

    // As a fallback, add the domain
    return `http://localhost:4040/${this.user.image}?t=${this.photoTimestamp}`;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    // Handle special case where success might be reported as error
    if (error.status === 200) {
      return 'Upload successful!';
    }

    if (error.error instanceof ErrorEvent) {
      return `Client-side error: ${error.error.message}`;
    } else {
      return `Server error: ${error.status} - ${error.error?.message || error.statusText || 'Unknown error'}`;
    }
  }
}

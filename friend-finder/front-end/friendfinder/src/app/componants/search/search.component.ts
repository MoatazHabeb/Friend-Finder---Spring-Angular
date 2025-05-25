import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PostService, SearchResponse, User, PostDto } from "../../../service/post.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {FriendService} from "../../../service/friend.service";
import {ProfileService} from "../../../service/profile.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchResults: SearchResponse = { users: [], posts: [] };
  isLoading = false;
  hasSearched = false;
  currentKeyword = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private isNavigatingProgrammatically = false; // Flag to prevent infinite loops
  currentUser: any;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private friendService: FriendService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Subscribe to route param changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const keyword = params.get('keyword');
        if (keyword) {
          const decodedKeyword = decodeURIComponent(keyword.trim());

          // Only update the input and search if the keyword from the URL is different
          // from what we currently consider the 'currentKeyword'
          if (decodedKeyword && decodedKeyword !== this.currentKeyword) {
            this.currentKeyword = decodedKeyword;

            // Set the flag before updating the form control to prevent valueChanges from reacting
            this.isNavigatingProgrammatically = true;
            this.searchControl.setValue(this.currentKeyword, { emitEvent: false });

            // Perform search AFTER input is set
            this.performSearch(this.currentKeyword);

            // Reset the flag after a small delay to allow DOM updates to settle
            // This is still needed to correctly handle subsequent user inputs
            setTimeout(() => this.isNavigatingProgrammatically = false, 50); // Reduced delay
          }
        } else {
          // No keyword in URL = reset everything
          this.resetToInitialState();
        }
      });

    // Reactive search on user typing (but only when it's not set programmatically)
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        if (this.isNavigatingProgrammatically) return;
        const trimmed = term?.trim();
        if (trimmed && trimmed !== this.currentKeyword) {
          this.navigateToSearch(trimmed);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEnterPress(): void {
    const searchValue = this.searchControl.value;
    if (searchValue && searchValue.trim()) {
      const newKeyword = searchValue.trim();
      // Only navigate if the new keyword is different from the current one in the URL
      if (newKeyword !== this.currentKeyword) {
        this.navigateToSearch(newKeyword);
      }
    }
  }

  onSearchClick(): void {
    this.onEnterPress();
  }

  private navigateToSearch(keyword: string): void {
    if (keyword === this.currentKeyword) return; // Prevent unnecessary navigation
    this.isNavigatingProgrammatically = true;
    this.router.navigate(['/search', encodeURIComponent(keyword)]).then(() => {
      setTimeout(() => {
        this.isNavigatingProgrammatically = false;
      }, 300);
    }).catch(() => {
      this.isNavigatingProgrammatically = false;
    });
  }

  private performSearch(term: string): void {
    const cleanTerm = term?.trim();
    if (!cleanTerm) {
      this.resetToInitialState(); // Reset if the term is empty
      return;
    }

    // Prevent redundant API calls
    if (this.currentKeyword === cleanTerm && this.hasSearched) {
      return;
    }

    this.currentKeyword = cleanTerm;
    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';

    this.postService.search(cleanTerm).subscribe({
      next: (results) => {
        this.searchResults = {
          users: results.users || [],  // make sure these are arrays, fallback empty array
          posts: results.posts || []
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = 'Failed to load search results. Please try again later.';
        this.isLoading = false;
        this.searchResults = { users: [], posts: [] };
        this.hasSearched = false; // Reset search state on error
      }
    });
  }


  clearSearch(): void {
    this.isNavigatingProgrammatically = true; // Set flag before navigating
    this.resetToInitialState(); // Reset component state

    this.router.navigate(['/search']).then(() => {
      // After navigation, reset the flag
      setTimeout(() => {
        this.isNavigatingProgrammatically = false;
      }, 50); // Reduced delay
    }).catch(err => {
      console.error('Clear search navigation error:', err);
      this.isNavigatingProgrammatically = false; // Ensure flag is reset on error
    });
  }

  private resetToInitialState(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.searchResults = { users: [], posts: [] };
    this.hasSearched = false;
    this.currentKeyword = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  navigateToProfile(userId: number): void {
    this.friendService.isHeaFriend(userId).subscribe({
      next: (isFriend) => {
        if (isFriend) {
          this.router.navigate(['/profile', userId]);
        } else {
          this.router.navigate(['/timelinerofile', userId]);
        }
      },
      error: (err) => {
        console.error('Error checking friend status:', err);
        // Default to profile if there's an error
        this.router.navigate(['/profile', userId]);
      }
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  trackByPostId(index: number, post: PostDto): number {
    return post.id;
  }
// In your component class
  getSafeUserImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/default-user.png';
    }
    // Check if the path already has the base URL
    if (imagePath.startsWith('http://localhost:4050/') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return 'http://localhost:4050' + imagePath;
  }

  getSafePostImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return ''; // Return empty string to trigger error handler
    }
    // Check if the path already has the base URL
    if (imagePath.startsWith('http://localhost:4050/') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return 'http://localhost:4050' + imagePath;
  }

  getSafePostVideo(videoPath: string | undefined): string {
    if (!videoPath) {
      return ''; // Return empty string to trigger error handler
    }
    // Check if the path already has the base URL
    if (videoPath.startsWith('http://localhost:4050/') ||
      videoPath.startsWith('https://') ||
      videoPath.startsWith('assets/')) {
      return videoPath;
    }
    return 'http://localhost:4050' + videoPath;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-user.png';
    imgElement.style.opacity = '0.7';
  }

  navigateToProfile2(userId: number | undefined): void {
    if (userId) {
      this.router.navigate(['/profile', userId]);
    } else {
      console.error('No user ID available for this post');
      // Optionally show an error message to the user
    }
  }

  handleVideoError(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    videoElement.style.display = 'none';
    // You could optionally show an error message here
  }


}

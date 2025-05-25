import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PostDto, PostService, Users } from "../../../../service/post.service";
import { TokenStorageService } from "../../../../service/token-storage.service";
import { ProfileService } from "../../../../service/profile.service";
import {AuthService} from "../../../../service/auth/auth.service";

interface React {
  id: number;
  type: 'LIKE' | 'DISLIKE';
  user: Users;
}

interface ExtendedPost extends PostDto {
  showComments: boolean;
  showLikesList: boolean;
  showDislikesList: boolean;
  newComment: string;
  userLiked: boolean;
  userDisliked: boolean;
  likes: React[];
  dislikes: React[];
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  posts: ExtendedPost[] = [];
  defaultImageUrl: string = 'assets/default-profile.png';
  currentUser: Users;
  loading = false;
  imageUrl: string = '';
  user: any;
  enlargedImageUrl: string = '';

  @ViewChild('imageModal') imageModal: any;
  constructor(
    private postService: PostService,
    private tokenService: TokenStorageService,
    private profileService: ProfileService,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadPosts();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: () => this.loadPosts(),
        error: (err) => console.error('Router error:', err)
      });
    if (this.authService.currentUser) {
      this.user = this.authService.currentUser;
    } else {
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
        this.authService.currentUser = user;
      });
    }
  }
  enlargeImage(imageUrl: string) {
    this.enlargedImageUrl = imageUrl;
    this.imageModal.nativeElement.classList.add('active');
  }

  closeImageModal() {
    this.enlargedImageUrl = '';
    this.imageModal.nativeElement.classList.remove('active');
  }

// Add this to handle clicking outside the image
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.enlargedImageUrl &&
      event.target === this.imageModal.nativeElement) {
      this.closeImageModal();
    }
  }


  loadPosts(): void {
    this.loading = true;
    if (this.router.url.includes('/mainpage')) {
      this.getAllPosts();
    }
  }

  loadProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.imageUrl = this.getFullImageUrl(user?.image);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  private getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return this.defaultImageUrl;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:4050${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = this.processPosts(posts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.loading = false;
      }
    });
  }

  private processPosts(posts: PostDto[]): ExtendedPost[] {
    return posts.map(post => ({
      ...post,
      showComments: false,
      showLikesList: false,
      showDislikesList: false,
      newComment: '',
      likes: [],
      dislikes: [],
      userLiked: false,
      userDisliked: false
    } as ExtendedPost)).map(post => {
      this.loadReactions(post);
      this.loadUserProfile(post);
      return post;
    });
  }

  private loadUserProfile(post: ExtendedPost): void {
    if (post.users && !post.users.fullname) {
      this.profileService.getUserProfileById(post.users.id).subscribe(
        (userProfile) => {
          post.users = { ...post.users, ...userProfile };
        },
        (error) => console.error('Error fetching user profile', error)
      );
    }
  }
  navigateToProfile(userId?: number | string): void {
    if (userId) {
      this.router.navigate(['/profile', userId]);
    } else {
      // Handle missing userId if needed
      console.warn('No user ID provided for profile navigation');
    }
  }
  toggleLikesList(post: ExtendedPost): void {
    post.showLikesList = !post.showLikesList;
    if (post.showLikesList && post.likes.length === 0) {
      this.loadLikes(post);
    }
    // Close dislikes if open
    if (post.showDislikesList) post.showDislikesList = false;
  }

  toggleDislikesList(post: ExtendedPost): void {
    post.showDislikesList = !post.showDislikesList;
    if (post.showDislikesList && post.dislikes.length === 0) {
      this.loadDislikes(post);
    }
    // Close likes if open
    if (post.showLikesList) post.showLikesList = false;
  }

  private loadReactions(post: ExtendedPost): void {
    this.loadLikes(post);
    this.loadDislikes(post);
  }

  private loadLikes(post: ExtendedPost): void {
    this.postService.countAndGetLikes(post.id).subscribe({
      next: (likes) => {
        post.likes = likes;
        post.userLiked = likes.some(like => like.user.id === this.currentUser?.id);
      },
      error: (error) => console.error('Error loading likes', error)
    });
  }

  private loadDislikes(post: ExtendedPost): void {
    this.postService.countAndGetDislikes(post.id).subscribe({
      next: (dislikes) => {
        post.dislikes = dislikes;
        post.userDisliked = dislikes.some(dislike => dislike.user.id === this.currentUser?.id);
      },
      error: (error) => console.error('Error loading dislikes', error)
    });
  }

  toggleLike(post: ExtendedPost): void {
    if (post.userLiked) {
      this.postService.unlikePost(post.id).subscribe({
        next: () => {
          post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
          post.userLiked = false;
          // If user had disliked before, we don't need to do anything
        },
        error: (err) => console.error('Error unliking post', err)
      });
    } else {
      this.postService.likePost(post.id).subscribe({
        next: (newLike) => {
          // Remove dislike if exists
          if (post.userDisliked) {
            post.dislikes = post.dislikes.filter(dislike => dislike.user.id !== this.currentUser.id);
            post.userDisliked = false;
          }
          // Add new like
          post.likes = [...post.likes, newLike];
          post.userLiked = true;
        },
        error: (err) => console.error('Error liking post', err)
      });
    }
  }

  toggleDislike(post: ExtendedPost): void {
    if (post.userDisliked) {
      this.postService.undislikePost(post.id).subscribe({
        next: () => {
          post.dislikes = post.dislikes.filter(dislike => dislike.user.id !== this.currentUser.id);
          post.userDisliked = false;
        },
        error: (err) => console.error('Error undisliking post', err)
      });
    } else {
      this.postService.dislikePost(post.id).subscribe({
        next: (newDislike) => {
          // Remove like if exists
          if (post.userLiked) {
            post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
            post.userLiked = false;
          }
          // Add new dislike
          post.dislikes = [...post.dislikes, newDislike];
          post.userDisliked = true;
        },
        error: (err) => console.error('Error disliking post', err)
      });
    }
  }

  toggleCommentSection(post: ExtendedPost): void {
    post.showComments = !post.showComments;
    if (post.showComments && (!post.commentList || post.commentList.length === 0)) {
      this.loadComments(post);
    }
  }

  loadComments(post: ExtendedPost): void {
    this.postService.getCommentsForPost(post.id).subscribe({
      next: (comments) => {
        post.commentList = comments;
        this.loadCommentAuthors(post.commentList);
      },
      error: (error) => console.error('Error loading comments', error)
    });
  }

  private loadCommentAuthors(comments: any[]): void {
    comments.forEach(comment => {
      if (comment.user && !comment.user.fullname) {
        this.profileService.getUserProfileById(comment.user.id).subscribe({
          next: (userProfile) => comment.user = { ...comment.user, ...userProfile },
          error: (error) => console.error('Error fetching comment author profile', error)
        });
      }
    });
  }

  addComment(post: ExtendedPost): void {
    if (!post.newComment?.trim()) return;

    const commentText = post.newComment.trim();
    post.newComment = '';

    this.postService.addComment(post.id, commentText).subscribe({
      next: (savedComment) => {
        if (!post.commentList) post.commentList = [];
        post.commentList = [savedComment, ...post.commentList];
        this.loadCommentAuthors([savedComment]);
      },
      error: (error) => {
        console.error('Error saving comment:', error);
        post.newComment = commentText;
      }
    });
  }
}

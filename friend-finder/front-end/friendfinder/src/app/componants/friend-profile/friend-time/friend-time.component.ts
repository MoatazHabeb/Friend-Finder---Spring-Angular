import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../../../service/token-storage.service';
import { PostDto, PostService, Comment, React, Users } from "../../../../service/post.service";
import { ProfileService } from "../../../../service/profile.service";

interface ExtendedPost extends PostDto {
  showComments: boolean;
  showLikesList: boolean;
  showDislikesList: boolean;
  newComment: string;
  userLiked: boolean;
  userDisliked: boolean;
  likes: any[];
  dislikes: any[];
}

@Component({
  selector: 'app-friend-time',
  templateUrl: './friend-time.component.html',
  styleUrls: ['./friend-time.component.css']
})
export class FriendTimeComponent implements OnInit {
  userId!: number;
  posts: ExtendedPost[] = [];
  currentUser: any;
  defaultImageUrl: string = 'assets/default-profile.png';
  imageUrl: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private tokenService: TokenStorageService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
   this.loadProfile();
    this.imageUrl = this.getFullImageUrl(this.currentUser?.image);

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.loadUserPosts();
      }
    });
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
  loadUserPosts(): void {
    this.loading = true;
    this.postService.getPostsByUserId(this.userId).subscribe({
      next: (posts) => {
        this.posts = this.processPosts(posts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
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

  getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return this.defaultImageUrl;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:4050${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  toggleLikesList(post: ExtendedPost): void {
    post.showLikesList = !post.showLikesList;
    if (post.showLikesList && post.likes.length === 0) {
      this.loadLikes(post);
    }
    if (post.showDislikesList) post.showDislikesList = false;
  }

  toggleDislikesList(post: ExtendedPost): void {
    post.showDislikesList = !post.showDislikesList;
    if (post.showDislikesList && post.dislikes.length === 0) {
      this.loadDislikes(post);
    }
    if (post.showLikesList) post.showLikesList = false;
  }

  toggleLike(post: ExtendedPost): void {
    if (post.userLiked) {
      this.postService.unlikePost(post.id).subscribe({
        next: () => {
          post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
          post.userLiked = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error unliking post', err)
      });
    } else {
      this.postService.likePost(post.id).subscribe({
        next: (newLike) => {
          if (post.userDisliked) {
            post.dislikes = post.dislikes.filter(dislike => dislike.user.id !== this.currentUser.id);
            post.userDisliked = false;
          }
          post.likes = [...post.likes, newLike];
          post.userLiked = true;
          this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error undisliking post', err)
      });
    } else {
      this.postService.dislikePost(post.id).subscribe({
        next: (newDislike) => {
          if (post.userLiked) {
            post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
            post.userLiked = false;
          }
          post.dislikes = [...post.dislikes, newDislike];
          post.userDisliked = true;
          this.cdr.detectChanges();
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, PostDto } from '../../../../service/post.service';
import { ProfileService } from '../../../../service/profile.service';
import { TokenStorageService } from '../../../../service/token-storage.service';

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
  selector: 'app-friend-album',
  templateUrl: './friend-album.component.html',
  styleUrls: ['./friend-album.component.css']
})
export class FriendAlbumComponent implements OnInit {
  posts: ExtendedPost[] = [];
  friendId!: number;
  currentUser: any;
  loading = false;
  imageUrl = '';
  selectedPost: ExtendedPost | null = null;
  defaultImageUrl: string = 'assets/default-profile.png';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private profileService: ProfileService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.friendId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCurrentUser();
    this.loadFriendPosts();
  }

  loadCurrentUser(): void {
    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.imageUrl = this.getFullImageUrl(user?.image);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  loadFriendPosts(): void {
    this.loading = true;
    this.postService.getPostsByUserId(this.friendId).subscribe({
      next: (posts) => {
        const imagePosts = posts.filter(post => post.image);
        this.posts = this.processPosts(imagePosts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching friend posts:', err);
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
        userProfile => post.users = { ...post.users, ...userProfile },
        error => console.error('Error fetching user profile', error)
      );
    }
  }

  private loadReactions(post: ExtendedPost): void {
    this.postService.countAndGetLikes(post.id).subscribe({
      next: (likes) => {
        post.likes = likes;
        post.userLiked = likes.some(like => like.user.id === this.currentUser?.id);
      },
      error: (error) => console.error('Error loading likes', error)
    });

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

  openImageModal(post: ExtendedPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';

    if (!post.commentList || post.commentList.length === 0) {
      this.loadComments(post);
    }
  }

  closeImageModal(): void {
    this.selectedPost = null;
    document.body.style.overflow = 'auto';
  }

  toggleLike(post: ExtendedPost): void {
    if (post.userLiked) {
      this.postService.unlikePost(post.id).subscribe(() => {
        post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
        post.userLiked = false;
      });
    } else {
      this.postService.likePost(post.id).subscribe((newLike) => {
        if (post.userDisliked) {
          post.dislikes = post.dislikes.filter(dislike => dislike.user.id !== this.currentUser.id);
          post.userDisliked = false;
        }
        post.likes = [...post.likes, newLike];
        post.userLiked = true;
      });
    }
  }

  toggleDislike(post: ExtendedPost): void {
    if (post.userDisliked) {
      this.postService.undislikePost(post.id).subscribe(() => {
        post.dislikes = post.dislikes.filter(dislike => dislike.user.id !== this.currentUser.id);
        post.userDisliked = false;
      });
    } else {
      this.postService.dislikePost(post.id).subscribe((newDislike) => {
        if (post.userLiked) {
          post.likes = post.likes.filter(like => like.user.id !== this.currentUser.id);
          post.userLiked = false;
        }
        post.dislikes = [...post.dislikes, newDislike];
        post.userDisliked = true;
      });
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
    const commentText = post.newComment?.trim();
    if (!commentText) return;
    post.newComment = '';

    this.postService.addComment(post.id, commentText).subscribe({
      next: (savedComment) => {
        post.commentList = [savedComment, ...(post.commentList || [])];
        this.loadCommentAuthors([savedComment]);
      },
      error: (error) => {
        console.error('Error saving comment:', error);
        post.newComment = commentText;
      }
    });
  }
}

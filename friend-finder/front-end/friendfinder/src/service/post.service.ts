import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:4050';
  private Url = 'http://localhost:4050/search';
  constructor(private http: HttpClient) {}

  // Post methods
  uploadPost(file: File | null, text: string): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('text', text);
    return this.http.post(`${this.baseUrl}/uploadPost`, formData);
  }

  getAllPosts(): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.baseUrl}/getAllPostes`);
  }

  getMyPosts(): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.baseUrl}/getMyAllPostes`);
  }

  // Like methods
  likePost(postId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/like`, {});
  }

  unlikePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${postId}/like`);
  }

  // Dislike methods
  dislikePost(postId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/dislike`, {});
  }

// Optional if you want explicit remove
  undislikePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${postId}/dislike`);
  }

  // Comment methods
  getCommentsForPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, text: string): Observable<Comment> {
    const payload = {
      text: text,
      postId: postId
    };
    return this.http.post<Comment>('http://localhost:4050/savecomment', payload);
  }

  // React methods
  getReactsForPost(postId: number): Observable<React[]> {
    return this.http.get<React[]>(`${this.baseUrl}/posts/${postId}/reacts`);
  }
  // Add these new methods
  countAndGetLikes(postId: number): Observable<React[]> {
    return this.http.get<React[]>(`${this.baseUrl}/countandgetlikes/${postId}`);
  }

  countAndGetDislikes(postId: number): Observable<React[]> {
    return this.http.get<React[]>(`${this.baseUrl}/countandgetdislikes/${postId}`);
  }
  getPostsByUserId(id: number): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.baseUrl}/getPostesById/${id}`);
  }
  search(letters: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.Url}/${letters}`);
  }

}

// Interfaces matching your backend DTOs
export interface PostDto {
  id: number;
  text: string;
  image: string;
  video: string;
  commentList: Comment[];
  reacts: React[];
  users: Users;  // Changed from 'author' to 'users'
  createdAt: Date;


  likeCount?: number;
  dislikeCount?: number;
}

export interface Comment {
  id: number;
  text: string;
  user: Users;  // Changed from 'author' to 'user' to match backend response
  createdAt: Date;
  reacts: React[];
  userLiked: boolean;
  userDisliked: boolean;
}

export interface React {
  id: number;
  type: 'LIKE' | 'DISLIKE'; // Simplified based on your backend
  user: Users;
}

export interface Users {
  id: number;
  fullname: string;
  image: string;
  gender: string;
  age: number;

}
export interface SearchResponse {
  users: User[];
  posts: PostDto[];
}
export interface User {
  id: number;
  fullname: string;
  email: string;
  age: string;
  gender: string;
  image: string;
  // Add other fields as needed
}

export interface Post {
  id: number;
  text: string;
  image: string;
  video: string;
  // Add other fields if needed
}

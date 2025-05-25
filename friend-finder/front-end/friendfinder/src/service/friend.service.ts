import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
export interface UserDTO {
  id: number;
  fullname: string;
  image: string;
  // other fields if needed
}

export interface FriendDTO {
  id: number;
  sender: UserDTO;     // <-- changed from senderName:string to sender:UserDTO
  receiver: UserDTO;   // <-- changed from receiverName:string to receiver:UserDTO
  accepted: boolean;
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private friendCountCache: number | null = null;
  private apiUrl = 'http://localhost:4050/api/friends';
  constructor(private http: HttpClient) {}
  sendFriendRequest(receiverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/send?receiverId=${receiverId}`, {});
  }
  getFriends(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/list`);
  }

  getPendingRequests(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/pending`);
  }

  acceptFriendRequest(senderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${senderId}`, {});
  }

  isHeaFriend(receiverId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/isHeaFriend/${receiverId}`);
  }
  getNonFriends(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/not-friends`);
  }
  getFriendCount(): Observable<number> {
    if (this.friendCountCache !== null) {
      return of(this.friendCountCache); // return cached
    }

    return this.http.get<number>('http://localhost:4050/api/friends/count').pipe(
      tap(count => this.friendCountCache = count)
    );
  }
  getFriendsById(id: number): Observable<FriendUserDto[]> {
    return this.http.get<FriendUserDto[]>(`${this.apiUrl}/getFriendsById/${id}`);
  }
}
export interface FriendUserDto {
  id: number;
  fullname: string;
  image: string;
  // Add more fields if needed
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
export interface Language {
  language: string;
}

export interface Interest {
  interest: string;
}

export interface UserDetailsDto {
  work: string;
  city: string;
  relationship: string;
  highSchool: string;
  college: string;
  bio: string;
  birthday: string;
  languages: Language[];
  interests: Interest[];
}
@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private apiUrl = 'http://localhost:4050/UserDetails/saveUserDetails';

  constructor(private http: HttpClient) {}
  getUserDetailsById(id: number) {
    return this.http.get<UserDetailsDto>(`http://localhost:4050/UserDetails/getUserDetailsById/${id}`);
  }
  saveUserDetails(details: UserDetailsDto): Observable<UserDetailsDto> {
    return this.http.post<UserDetailsDto>(this.apiUrl, details);
  }
  getUserDetails(): Observable<UserDetailsDto> {
    return this.http.get<UserDetailsDto>('http://localhost:4050/UserDetails/getUserDetails');
  }

}

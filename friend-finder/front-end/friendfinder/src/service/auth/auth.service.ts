import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {UserDto} from "../../model/user-dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl= 'http://localhost:4050';
  baseUrl = 'http://localhost:4050/user'; // /create-client   //login
  currentUser: any;  // or BehaviorSubject
  constructor(private http: HttpClient) { }
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  createAccount(name: string, email: string, phoneNumber: string, password: string, age: string, gender: string): Observable<any> {
    // ✅ Client-side password validation
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordPattern.test(password)) {
      return throwError({
        messageEn: 'Password must be at least 8 characters long and include letters, numbers, and special characters.',
        messageAr: 'يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل وتشمل حروفًا وأرقامًا ورموزًا خاصة.'
      });
    }

    // ✅ Proceed with API call if password is valid
    return this.http.post(this.baseUrl + '/create-user', { fullname: name,
      email,
      phoneNumber,
      password,
      age,
      gender }).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        // Handle validation errors from server
        if (error.status === 400 && error.error) {
          return throwError(error.error); // Return the validation errors
        }
        return throwError({
          messageEn: 'An unexpected error occurred.',
          messageAr: 'حدث خطأ غير متوقع.'
        });
      })
    );
  }

  login(email, password): Observable<any> {
    return this.http.post(this.baseUrl + '/login', {email, password}).pipe(
      map(
        response => response
      )
    );
  }

  // tslint:disable-next-line:typedef
  isUserLogIn(){
    return sessionStorage.getItem('token') != null &&  sessionStorage.getItem('token') != undefined;
  }

  // tslint:disable-next-line:typedef
  isUserAdmin(){
    const roles = sessionStorage.getItem('roles');

    if (roles && roles.includes('ADMIN')) {
      return true;
    } else {
      return false;
    }
  }
  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:4050/user/me').pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => {
        this.clearUserState();
        return throwError(error);
      })
    );
  }

  getOnlineUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/user/online-users`);
  }
  logout(): Observable<any> {
    return this.http.post('http://localhost:4050/user/logout', {}).pipe(
      tap(() => this.clearUserState()),
      catchError(error => {
        this.clearUserState(); // Still clear state even if logout API fails
        return throwError(error);
      })
    );
  }

  clearUserState() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    this.currentUserSubject.next(null);
  }

}

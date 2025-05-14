import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:4050/user'; // /create-client   //login
  constructor(private http: HttpClient) { }

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
}

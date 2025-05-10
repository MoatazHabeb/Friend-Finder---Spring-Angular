import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:4040/user';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      retry(1), // Retry once before failing
      tap(response => {
        console.log('Profile data received:', response);
      }),
      catchError(this.handleError)
    );
  }

  uploadProfilePhoto(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
      // Don't set Content-Type here, it will be set automatically with the correct boundary for multipart/form-data
    });

    // Try a more simple approach without complex options
    return this.http.post(`${this.apiUrl}/upload-profile-image`, formData, {
      headers: headers
    }).pipe(
      tap(response => {
        console.log('Upload response:', response);
      }),
      catchError(error => {
        console.error('Raw upload error:', error);
        // If we get an empty or undefined error, provide more context
        if (!error || (!error.status && !error.error)) {
          return throwError(() => new Error('Connection error - Unable to reach the server. Please check your network connection.'));
        }
        // Special case for CORS issues which often show up as "Unknown error"
        if (error.status === 0 || error.name === 'HttpErrorResponse' && !error.error) {
          return throwError(() => new Error('CORS error or network issue - Check server configuration'));
        }
        return this.handleError(error);
      })
    );
  }

  getFollowers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/followers`).pipe(
      catchError(this.handleError)
    );
  }

  updateProfileInfo(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData).pipe(
      catchError(this.handleError)
    );
  }

  // Improved error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.error?.message || error.statusText || 'Unknown error'}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

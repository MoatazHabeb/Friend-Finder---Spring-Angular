import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:4050/user';
  constructor(private http: HttpClient) { }

  private cachedProfile: any = null;

// Get My Profile
  getUserProfile(forceReload = false): Observable<any> {
    if (this.cachedProfile && !forceReload) {
      return of(this.cachedProfile);
    }

    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap(response => {
        this.cachedProfile = response;
      }),
      catchError(error => {
        this.cachedProfile = null;
        return throwError(error);
      })
    );
  }


}

// review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import {AuthService} from "../../../front-office/services/auth.service";
 // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `http://localhost:8089/training-sessions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getReviews(sessionId: number): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/${sessionId}/reviews/all`, { headers })
      )
    );
  }

  getReviewById(sessionId: number, reviewId: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/${sessionId}/reviews/${reviewId}`, { headers })
      )
    );
  }

  createReview(sessionId: number, review: { rating: number, description: string }): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/${sessionId}/reviews/create`, review, { headers })
      )
    );
  }

  updateReview(sessionId: number, reviewId: number, review: { rating: number, description: string }): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/${sessionId}/reviews/${reviewId}/update`, review, { headers })
      )
    );
  }

  deleteReview(sessionId: number, reviewId: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/${sessionId}/reviews/${reviewId}/delete`, { headers })
      )
    );
  }



  getReviewsByCoachId(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/reviews`, { headers })
      )
    );
  }
}

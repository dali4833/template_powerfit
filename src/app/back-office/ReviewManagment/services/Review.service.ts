import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `http://localhost:8089/training-sessions`;
  private cachedToken: string | null = null;

  clubaccount = {
    username: 'CLUB@email.com',
    password: 'a',
  };

  adminaccount = {
    username: 'ADMIN@email.com',
    password: 'a',
  };

  useraccount = {
    username: 'user1@email.com',
    password: 'a',
  };

  coachaccount = {
    username: 'COACH@email.com',
    password: 'a',
  };

  constructor(
    private http: HttpClient,
  ) { }

  private async getValidToken(): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    try {
      this.cachedToken = await lastValueFrom(this.bypassUser());
      return this.cachedToken;
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  }

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = await this.getValidToken();
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

  bypassclub(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.clubaccount, { responseType: 'text' });
  }

  bypassadmin(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.adminaccount, { responseType: 'text' });
  }

  bypassUser(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.useraccount, { responseType: 'text' });
  }

  bypasscoach(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.coachaccount, { responseType: 'text' });
  }
}
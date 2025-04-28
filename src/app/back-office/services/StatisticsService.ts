import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import {AuthService} from "../../front-office/services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8089/statistics';

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBookingsByDayOfWeek(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/bookings-by-day`, { headers })
      )
    );
  }

  getBookingsByHour(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/bookings-by-hour`, { headers })
      )
    );
  }

  getAvgRatingPerSession(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/average-rating-per-session`, { headers })
      )
    );
  }

  getReviewCountPerSession(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/review-count-per-session`, { headers })
      )
    );
  }
}

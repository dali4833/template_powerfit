import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '../../../front-office/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private apiUrl = `http://localhost:8089/training-sessions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTrainingSessions(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-TrainingSessions`, { headers })
      )
    );
  }

  getTrainingSessionsByCoach(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/coach/sessions`, { headers })
      )
    );
  }


  getRecommendedCoaches(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/recommended`, { headers })
      )
    );
  }

  getTrainingSession(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-TrainingSession/${id}`, { headers })
      )
    );
  }

  createTrainingSession(session: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-TrainingSession`, session, { headers })
      )
    );
  }

  updateTrainingSession(session: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-TrainingSession`, session, { headers })
      )
    );
  }

  deleteTrainingSession(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/delete-TrainingSession/${id}`, { headers })
      )
    );
  }

  getEventsInRange(start: Date, end: Date): Observable<any[]> {
    const params = new HttpParams()
      .set('start', start.toISOString().split('T')[0])
      .set('end', end.toISOString().split('T')[0]);

    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/coach/sessions/range`, { headers, params })
      )
    );
  }


  getstats(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<void>(`http://localhost:8089/statistics/stats`, { headers })
      )
    );
  }
}

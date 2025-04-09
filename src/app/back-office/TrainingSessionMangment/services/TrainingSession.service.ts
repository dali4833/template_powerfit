import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
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
      this.cachedToken = await lastValueFrom(this.bypasscoach());
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

  getTrainingSessions(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => 
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-TrainingSessions`, { headers })
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

  createTrainingSession(object: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-TrainingSession`, object, { headers })
      )
    );
  }

  updateTrainingSession(object: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-TrainingSession`, object, { headers })
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { Sport } from '../models/sport';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  private apiUrl = `http://localhost:8089/sports`;
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
      this.cachedToken = await lastValueFrom(this.bypassadmin());
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

  getSports(): Observable<Sport[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => 
        this.http.get<Sport[]>(`${this.apiUrl}/retrieve-all-sports`, { headers })
      )
    );
  }

  getSport(id: number): Observable<Sport> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Sport>(`${this.apiUrl}/retrieve-sport/${id}`, { headers })
      )
    );
  }

  createSport(sport: Sport): Observable<Sport> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<Sport>(`${this.apiUrl}/add-sport`, sport, { headers })
      )
    );
  }

  updateSport(sport: Sport, id: number): Observable<Sport> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<Sport>(`${this.apiUrl}/update-sport/${id}`, sport, { headers })
      )
    );
  }

  deleteSport(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-sport/${id}`, { headers })
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
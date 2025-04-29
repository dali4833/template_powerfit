import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrophyService {
  private apiUrl = `http://localhost:8089/trophies`;
  private cachedToken: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTrophies(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-trophies`, { headers })
      )
    );
  }

  getTrophy(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-trophy/${id}`, { headers })
      )
    );
  }

  createTrophy(trophy: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-trophy`, trophy, { headers })
      )
    );
  }

  updateTrophy(trophy: any, id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-trophy/${id}`, trophy, { headers })
      )
    );
  }

  deleteTrophy(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-trophy/${id}`, { headers })
      )
    );
  }

  updateUserPoints(userId: number, points: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/updatePoints/${userId}/${points}`, { headers })
      )
    );
  }

  getUserPoints(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/my-trophies`, { headers })
      )
    );
  }

  assignTrophyToUser(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(
          `http://localhost:8089/trophies/assignTrophy`,
          {}, // Empty body
          { headers }
        )
      )
    );
  }
}

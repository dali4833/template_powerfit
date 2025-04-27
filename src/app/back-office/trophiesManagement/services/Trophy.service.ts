import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { adminaccount, useraccount } from './bypass';

@Injectable({
  providedIn: 'root'
})
export class TrophyService {
  private apiUrl = `http://localhost:8089/trophies`;
  private cachedToken: string | null = null;






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

  //get valid user token
  private async getValidUserToken(): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    try {
      this.cachedToken = await lastValueFrom(this.bypassuser());
      return this.cachedToken;
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  }







  getUserPoints(): Observable<any> {
    return from(this.getValidUserToken()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/my-trophies`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${headers}`
          })
        })
      )
    );
  }
  assignTrophyToUser(): Observable<any> {
    return from(this.getValidUserToken()).pipe(
      switchMap(token =>
        this.http.post<any>(
          `http://localhost:8089/trophies/assignTrophy`,
          {}, // Body vide
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            })
          }
        )
      )
    );
  }



  bypassadmin(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      adminaccount, { responseType: 'text' });
  }

  bypassuser(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      useraccount, { responseType: 'text' });
  }


}

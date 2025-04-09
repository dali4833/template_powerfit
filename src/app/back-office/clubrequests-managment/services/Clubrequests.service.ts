import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubrequestsService {
  private apiUrl = `http://localhost:8089/clubs`;
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



  getPendingRequests(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/admin/pending-requests`, { headers })
      )
    );
  }

  approveClubCreationRequest(requestId: any): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<void>(`${this.apiUrl}/admin/approve/${requestId}`, {}, { headers })
      )
    );
  }

  rejectClubCreationRequest(requestId: any): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<void>(`${this.apiUrl}/admin/reject/${requestId}`, {}, { headers })
      )
    );
  }








  bypassclub(): Observable<string> {
    console.log("bypassclub called");
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.clubaccount, { responseType: 'text' });
  }

  bypassadmin(): Observable<string> {
    console.log("bypassadmin called");
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.adminaccount, { responseType: 'text' });
  }

  bypassUser(): Observable<string> {
    console.log("bypassUser called");
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.useraccount, { responseType: 'text' });
  }

  bypasscoach(): Observable<string> {
    console.log("bypasscoach called");
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      this.coachaccount, { responseType: 'text' });
  }
}
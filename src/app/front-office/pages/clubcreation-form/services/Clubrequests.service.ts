import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { adminaccount } from 'src/app/back-office/sports-managment/services/bypass';
@Injectable({
  providedIn: 'root'
})
export class ClubrequestsService {
  private apiUrl = `http://localhost:8089/clubs`;
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











  bypassadmin(): Observable<string> {
    console.log("bypassadmin called");
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      adminaccount, { responseType: 'text' });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { useraccount , clubaccount } from '../../sports-managment/services/bypass';
interface request {
  startDate: string;
  endDate: string;
}


@Injectable({
  providedIn: 'root'
})
export class AbonnementrequestsService {
  private apiUrl = 'http://localhost:8089/abonnement-requests';
  private cachedToken: string | null = null;


  constructor(private http: HttpClient) { }

  private async getValidToken(account: any): Promise<string> {
    if (this.cachedToken) return this.cachedToken;

    try {
      const token = await lastValueFrom(this.http.post<string>(
        'http://localhost:8089/auth/generateToken',
        account,
        { responseType: 'text' as 'json' }
      ));
      this.cachedToken = token;
      return token;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      throw error;
    }
  }

  private async generateHeaders(account: any): Promise<HttpHeaders> {
    const token = await this.getValidToken(account);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  // Pour USER
  createRequest(object: request, packId: number): Observable<any> {
    this.cachedToken = null;
    const params = {
      startDate: object.startDate,
      endDate: object.endDate
    };
    
    return from(this.generateHeaders(useraccount)).pipe(
      switchMap(headers =>
        this.http.post<any>(
          `${this.apiUrl}/request/${packId}`, 
          null, 
          { 
            headers,
            params
          }
        )
      )
    );
  }

  createRequestWithDates(packId: number, startDate: string, endDate: string): Observable<any> {
    const params = { packId: packId.toString(), startDate, endDate };
    return from(this.generateHeaders(useraccount)).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/abonnement-request`, {}, { headers, params })
      )
    );
  }

  // Pour CLUB OWNER
  getRequests(): Observable<any[]> {
    return from(this.generateHeaders(clubaccount)).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/club-owner/requests`, { headers })
      )
    );
  }
  getpacks(): Observable<any[]> {
    return from(this.generateHeaders(useraccount)).pipe(
      switchMap(headers =>
        this.http.get<any[]>('http://localhost:8089/packs', { headers }) // ⚠️ adapte l'URL si besoin
      )
    );
  }


  approveRequest(requestId: number): Observable<any> {
    return from(this.generateHeaders(clubaccount)).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/approve/${requestId}`, {}, { headers })
      )
    );
  }
}

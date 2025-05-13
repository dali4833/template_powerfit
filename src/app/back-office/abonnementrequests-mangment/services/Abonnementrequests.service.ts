import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
import { environment } from '../../../../environments/environment';

interface Request {
  startDate: string;
  endDate: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AbonnementrequestsService {
  private apiUrl = `${environment.apiUrl}/abonnement-requests`;

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

  // Pour USER
  createRequest(object: Request, packId: number): Observable<any> {
    if (object.duration == null || object.duration <= 0) {
      return new Observable(observer => {
        observer.error(new Error('Invalid duration for subscription.'));
      });
    }

    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/request/${packId}`, object, { headers })
      )
    );
  }

  // Pour CLUB OWNER
  getRequests(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/club-owner/requests`, { headers })
      )
    );
  }

  getPacks(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${environment.apiUrl}/packs`, { headers })
      )
    );
  }

  approveRequest(requestId: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/approve/${requestId}`, null, { headers })
      )
    );
  }
}

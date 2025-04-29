import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ClubrequestsService {
  private apiUrl = `http://localhost:8089/clubs`;
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


 



  submitClubCreationRequest(formData: FormData): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => {
        const headersWithoutContentType = headers.delete('Content-Type');
        return this.http.post<any>(
          `${this.apiUrl}/submit-creation-request`,
          formData,
          { headers: headersWithoutContentType }
        );
      })
    );
  }
  

  getPendingRequests(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/admin/pending-requests`, { headers })
      )
    );
  }
  getRequestDocument(requestId: number): Observable<Blob> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get(`${this.apiUrl}/admin/document/${requestId}`, {
          headers,
          responseType: 'blob' // très important pour recevoir des fichiers
        })
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










}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, switchMap, Observable } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  private baseUrlMeetings = 'http://localhost:8089/meeting'; 
  private baseUrlDossiers = 'http://localhost:8089/dossier';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMeetingStats(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.baseUrlMeetings}/meetings`, { headers })
      )
    );
  }

  getMedicalFolderStats(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.baseUrlDossiers}/medicalfolders`, { headers })
      )
    );
  }
}

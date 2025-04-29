import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private apiUrl = `http://localhost:8089/abonnements`;
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




  getAbonnements(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-abonnements`, { headers })
      )
    );
  }

  getAbonnement(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-abonnement/${id}`, { headers })
      )
    );
  }

  createAbonnement(packId: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-abonnement`, packId, { headers })
      )
    );
  }

  updateAbonnement(abonnement: any, id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-abonnement/${id}`, abonnement, { headers })
      )
    );
  }

  deleteAbonnement(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-abonnement/${id}`, { headers })
      )
    );
  }



  validateAbonnement(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/validate-abonnement/${id}`, {}, { headers })
      )
    );
  }




  getUsers(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`http://localhost:8089/auth/users`, { headers })
      )
    );
  }


  getpacks(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`http://localhost:8089/packs/retrieve-all-packs`, { headers })
      )
    );
  }


  renewAbonnement(id: number, packDuration: number): Observable<any> {
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + packDuration);

    const formattedEndDate = newEndDate.toISOString().split('T')[0]; // Ensure format is YYYY-MM-DD

    console.log('New End Date:', formattedEndDate);

    return from(this.generateHeaders()).pipe(
        switchMap(headers =>
            this.http.put<any>(
                `${this.apiUrl}/renew-abonnement/${id}?newEndDate=${formattedEndDate}`,
                {}, // Empty body
                { headers }
            )
        )
    );
  }





  calculateRenewalRateForClub(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/calculateRenewalRateForClub/${id}`, { headers })
      )
    );
  }

  analyzeClubPerformancee(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/analyzeClubPerformance/${id}`, { headers })
      )
    );
  }
  analyzeClubPerformance(clubId: number): Observable<any> {
    console.log('Sending clubId:', clubId);  // Vérifie que le clubId est bien passé
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/analyzeClubPerformance/${clubId}`, { headers })
      )
    );
  }









  getUserAbonnementsHistory(): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<any>(`${this.apiUrl}/user-history`, { headers });
      })
    );
  }





}

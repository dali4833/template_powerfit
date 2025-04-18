import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { clubaccount } from '../../sports-managment/services/bypass';
@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private apiUrl = `http://localhost:8089/abonnements`;
  private cachedToken: string | null = null;



  bypassclub(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      clubaccount, { responseType: 'text' });
  }


  constructor(
    private http: HttpClient,
  ) { }

  private async getValidToken(): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    try {
      this.cachedToken = await lastValueFrom(this.bypassclub());
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


  

}
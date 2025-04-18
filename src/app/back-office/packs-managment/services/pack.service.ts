import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { clubaccount } from '../../sports-managment/services/bypass';
@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = `http://localhost:8089/packs`;
  private cachedToken: string | null = null;

 
 

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

  getpacks(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => 
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-packs`, { headers })
      )
    );
  }

  getpack(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-pack/${id}`, { headers })
      )
    );
  }

  createPack(pack: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-pack`, pack, { headers })
      )
    );
  }

  updatepack(pack: any, id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-pack/${id}`, pack, { headers })
      )
    );
  }

  deletepack(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-pack/${id}`, { headers })
      )
    );
  }

  affecterPackToclub(id: number, idclub: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/affect-pack/${id}/to-club/${idclub}`, {}, { headers })
      )
    );
  }

  bypassclub(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      clubaccount, { responseType: 'text' });
  }



  
}
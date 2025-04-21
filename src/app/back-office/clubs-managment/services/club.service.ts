import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { clubaccount , useraccount} from '../../sports-managment/services/bypass';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
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

  getClubs(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-clubs`, { headers })
      )
    );
  }

  getClub(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-clubs/${id}`, { headers })
      )
    );
  }

  createClub(club: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-club`, club, { headers })
      )
    );
  }

  updateClub(club: any, id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-club/${id}`, club, { headers })
      )
    );
  }

  deleteClub(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-club/${id}`, { headers })
      )
    );
  }

  affecterSportToClub(clubId: any, sportId: any): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<void>(`${this.apiUrl}/${clubId}/sports/${sportId}`, null, { headers })
      )
    );
  }

  submitClubCreationRequest(body: FormData): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => {
        // remove 'Content-Type' because FormData needs boundary
        const filteredHeaders = headers.delete('Content-Type');
        return this.http.post<any>(`${this.apiUrl}/submit-creation-request`, body, { headers: filteredHeaders });
      })
    );
  }





  bypassclub(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      clubaccount, { responseType: 'text' });
  }



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



  private async generateUserHeaders(): Promise<HttpHeaders> {
    const token = await this.getValidUserToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }



  getrecommandations(): Observable<any[]> {
    return from(this.generateUserHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/recommended-ids`, { headers })
      )
    );
  }

 bypassuser(): Observable<string> {
    return this.http.post(`http://localhost:8089/auth/generateToken`,
      useraccount, { responseType: 'text' });
  }

}

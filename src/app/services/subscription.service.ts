import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/abonnement-requests';
  private cachedToken: string | null = null;

  private useraccount = {
    username: 'test@hotmail.fr',
    password: 'password123',
  };

  private clubaccount = {
    username: 'CLUB@email.com',
    password: 'a',
  };

  constructor(private http: HttpClient) {}

  // Méthode pour s'abonner à un pack
  subscribeToPack(packId: number, subscription: { startDate: string; endDate: string }): Observable<any> {
    console.log('subscribeToPack called with:', { packId, subscription }); // Vérifiez si cela est appelé automatiquement
    const params = new URLSearchParams();
    params.append('packId', packId.toString());
    params.append('startDate', subscription.startDate);
    params.append('endDate', subscription.endDate);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cachedToken}`, // Assurez-vous que le token est valide
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/abonnement-request?${params.toString()}`, null, { headers });
  }

  // Méthode pour récupérer un token valide
  private async getValidToken(account: any): Promise<string> {
    if (this.cachedToken) return this.cachedToken;

    try {
      const token = await lastValueFrom(this.http.post<string>(
        `${environment.apiUrl}/auth/generateToken',
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

  // Méthode pour générer les en-têtes avec le token
  private async generateHeaders(account: any): Promise<HttpHeaders> {
    const token = await this.getValidToken(account);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  renewAbonnement(abonnementId: number, newEndDate: string): Observable<any> {
    return this.http.put(`/api/abonnements/${abonnementId}/renew`, {
      newEndDate: newEndDate
    });
  }

}

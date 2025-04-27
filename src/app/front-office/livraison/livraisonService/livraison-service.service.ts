import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livraison {
  idLivraison: number;
  address: string;
  duration: Date;
  scheduleddate: Date;
  status: string; // PENDING, DISPATCHED, DELIVERED
}

@Injectable({
  providedIn: 'root',
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8087/api/Livraison';

  constructor(private http: HttpClient) {}

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/retrieve-all-livraison`);
  }

  addLivraison(livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.apiUrl}/add-livraison`, livraison);
  }

  deleteLivraison(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeLivraison/${id}`);
  }

  getStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statistics`);
  }

  acceptDelivery(livraisonId: number, driverName: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/accept/${livraisonId}?driverName=${encodeURIComponent(driverName)}`,
      {}  // Empty body
    );
  }

  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/retrieve-livraison/${id}`);
  }

  markAsDelivered(livraisonId: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/mark-delivered/${livraisonId}`, {});
  }
}

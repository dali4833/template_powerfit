// `src/app/services/PromotionService/promotion.service.ts`
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promotion {
  id: number;
  category: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  expiryDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'http://localhost:8087/api/promotions'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/get-all`);
  }

  getPromotionById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  createPromotion(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.apiUrl}/add-promotion`, promotion);
  }

  updatePromotion(id: number, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promotion);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

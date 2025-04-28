// backnutri.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nutritionist {
  id: number;
  name: string;
  email: string;
  phone: string;
  salary: number;
  hiredDate: Date;
}

@Injectable({ providedIn: 'root' })
export class BacknutriService {
  private apiUrl = 'http://localhost:8089/nutritionist';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoaWJhQGdtYWlsLmNvbSIsImlhdCI6MTc0NTc3MTE3NiwiZXhwIjoxNzQ1ODc5MTc2fQ.y2hJcW7iyvNcrvhorKWbkYN2LWUDbfg-uW0TdSti9LM';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllNutritionists(): Observable<Nutritionist[]> {
    return this.http.get<Nutritionist[]>(
      `${this.apiUrl}/retrieve-all-nutritionist`,
      { headers: this.getAuthHeaders() }
    );
  }

  getNutritionistById(nutritionistId: number): Observable<Nutritionist> {
    return this.http.get<Nutritionist>(
      `${this.apiUrl}/retrieve-nutritionist/${nutritionistId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.http.post<Nutritionist>(
      `${this.apiUrl}/add-nutritionist`,
      nutritionist,
      { headers: this.getAuthHeaders() }
    );
  }

  updateNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.http.put<Nutritionist>(
      `${this.apiUrl}/update-nutritionist`,
      nutritionist,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteNutritionist(nutritionistId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/remove-nutritionist/${nutritionistId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}

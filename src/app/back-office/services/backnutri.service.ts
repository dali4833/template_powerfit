import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nutritionist {
  id: number;  // L'ID peut être optionnel si c'est généré automatiquement par le backend
  name: string;
  
  email: string;
  phone: string;
  salary: number;
  hiredDate: Date;  // ou Date selon la manière dont tu veux manipuler les dates
}

@Injectable({
  providedIn: 'root'
})
export class BacknutriService {
  private apiUrl = 'http://localhost:8089/nutritionist';

  constructor(private http: HttpClient) {}

  // Récupérer tous les nutritionnistes
  getAllNutritionists(): Observable<Nutritionist[]> {
    return this.http.get<Nutritionist[]>(`${this.apiUrl}/retrieve-all-nutritionist`);
  }

  // Récupérer un nutritionniste par son ID
  getNutritionistById(nutritionistId: number): Observable<Nutritionist> {
    return this.http.get<Nutritionist>(`${this.apiUrl}/retrieve-nutritionist/${nutritionistId}`);
  }

  // Ajouter un nutritionniste
  addNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.http.post<Nutritionist>(`${this.apiUrl}/add-nutritionist`, nutritionist);
  }

  // Mettre à jour un nutritionniste
  updateNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.http.put<Nutritionist>(`${this.apiUrl}/update-nutritionist`, nutritionist);
  }

  // Supprimer un nutritionniste par son ID
  deleteNutritionist(nutritionistId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-nutritionist/${nutritionistId}`);
  }
}

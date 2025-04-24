import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalFolder {
  id: number; 
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  birthDate: Date;
  gender: 'Male' | 'Female' ;

  // Consultation info
  
  
  reasonForVisit: string; // ex: perte de poids, diabète, etc.
  notes: string;

  // Suivi nutritionnel
  weight: number; // en kg
  height: number; // en cm
  bmi?: number; // calculé
  allergies?: string;
  medicalHistory?: string;

  // Programme recommandé
  

  createdAt: Date;
  updatedAt?: Date;
}
export interface GenderStat {
  count: number;
  percentage: number;
}


@Injectable({
  providedIn: 'root'
})
export class MedicalfolderService {
  private baseUrl = 'http://localhost:8089/dossier'; // Change selon ton backend

  constructor(private http: HttpClient) {}

  // GET all dossiers
  getAllDossiers(): Observable<MedicalFolder[]> {
    return this.http.get<MedicalFolder[]>(`${this.baseUrl}/retrieve-all-dossiers`);
  }

  // POST new dossier
  addDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    return this.http.post<MedicalFolder>(`${this.baseUrl}/add-dossier`, dossier);
  }

  // PUT update dossier
  
  updateDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    return this.http.put<MedicalFolder>(`${this.baseUrl}/update-dossier`, dossier);
  }
  

  // DELETE dossier by ID
  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-dossier/${id}`);
  }
  getMedicalFolderById(id: number): Observable<MedicalFolder> {
    return this.http.get<MedicalFolder>(`${this.baseUrl}/retrieve-dossier/${id}`);
  }
  // GET gender statistics (count & percentage)
  getGenderStats(): Observable<{ [key: string]: GenderStat }> {
    return this.http.get<{ [key: string]: GenderStat }>(`${this.baseUrl}/gender-stats`);
  }
  
}

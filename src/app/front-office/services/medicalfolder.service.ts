import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalFolder {
  id: number;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  birthDate: Date;
  gender: 'Male' | 'Female';
  reasonForVisit: string;
  notes: string;
  weight: number;
  height: number;
  bmi?: number;
  allergies?: string;
  medicalHistory?: string;
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
  private baseUrl = 'http://localhost:8089/dossier';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoaWJhQGdtYWlsLmNvbSIsImlhdCI6MTc0NTUzMTI4MSwiZXhwIjoxNzQ1NjM5MjgxfQ.r6r4xbIILydy6e7E8Q9Xdje4KcodUjtI8qbMe_rQYBo';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllDossiers(): Observable<MedicalFolder[]> {
    return this.http.get<MedicalFolder[]>(`${this.baseUrl}/retrieve-all-dossiers`, {
      headers: this.getAuthHeaders()
    });
  }

  addDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    console.log(this.getAuthHeaders);
    return this.http.post<MedicalFolder>(`${this.baseUrl}/add-dossier`, dossier, {
      headers: this.getAuthHeaders()
    });
  }

  updateDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    return this.http.put<MedicalFolder>(`${this.baseUrl}/update-dossier`, dossier, {
      headers: this.getAuthHeaders()
    });
  }

  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-dossier/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getMedicalFolderById(id: number): Observable<MedicalFolder> {
    return this.http.get<MedicalFolder>(`${this.baseUrl}/retrieve-dossier/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getGenderStats(): Observable<{ [key: string]: GenderStat }> {
    return this.http.get<{ [key: string]: GenderStat }>(`${this.baseUrl}/gender-stats`, {
      headers: this.getAuthHeaders()
    });
  }
}

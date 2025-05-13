import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
import {environment} from "../../../environments/environment";

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

export interface Meeting {
  id: number;
  date: string;
  patientName: string;
  status: string;
  notes: string;
}

export interface GenderStat {
  count: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalfolderService {
  private baseUrl = `${environment.apiUrl}/dossier`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllDossiers(): Observable<MedicalFolder[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<MedicalFolder[]>(`${this.baseUrl}/retrieve-all-dossiers`, { headers })
      )
    );
  }

  addDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<MedicalFolder>(`${this.baseUrl}/add-dossier`, dossier, { headers })
      )
    );
  }

  updateDossier(dossier: MedicalFolder): Observable<MedicalFolder> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<MedicalFolder>(`${this.baseUrl}/update-dossier`, dossier, { headers })
      )
    );
  }

  deleteDossier(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.baseUrl}/remove-dossier/${id}`, { headers })
      )
    );
  }

  getMedicalFolderById(id: number): Observable<MedicalFolder> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<MedicalFolder>(`${this.baseUrl}/retrieve-dossier/${id}`, { headers })
      )
    );
  }

  getGenderStats(): Observable<{ [key: string]: GenderStat }> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<{ [key: string]: GenderStat }>(`${this.baseUrl}/gender-stats`, { headers })
      )
    );
  }

  getMeetingsByFolderId(id: number): Observable<Meeting[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Meeting[]>(`${this.baseUrl}/${id}/meetings`, { headers })
      )
    );
  }
}

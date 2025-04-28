import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MeetingRequest {
  patientName: string;
  date: string;  // Format backend "2025-04-29T10:00:00"
  status: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingdossierService {
  private apiUrl = 'http://localhost:8089/meeting';

  constructor(private http: HttpClient) {}

  // Fonction pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoaWJhQGdtYWlsLmNvbSIsImlhdCI6MTc0NTc3MTE3NiwiZXhwIjoxNzQ1ODc5MTc2fQ.y2hJcW7iyvNcrvhorKWbkYN2LWUDbfg-uW0TdSti9LM';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Utilisez les headers avec l'authentification dans votre requête
  addMeetingWithDossier(dossierId: number, meeting: any): Observable<string> {
    console.log("Sending meeting data: ", meeting);  // Log pour vérifier les données
    const url = `${this.apiUrl}/add-meeting-with-dossier`;
    const headers = this.getAuthHeaders();

    return this.http.post<string>(url, meeting, { headers: headers, params: { dossierId: dossierId.toString() } });
}

}

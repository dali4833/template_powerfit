import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  private baseUrlMeetings = 'http://localhost:8089/meeting'; 
  private baseUrlDossiers = 'http://localhost:8089/dossier';

  constructor(private http: HttpClient) { }

  getMeetingStats() {
    return this.http.get<any>(`${this.baseUrlMeetings}/meetings`);
  }

  getMedicalFolderStats() {
    return this.http.get<any>(`${this.baseUrlDossiers}/medicalfolders`);
  }
}

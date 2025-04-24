import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Meeting {
  id: number;
  patientName: string;
  date: Date;
  status: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8089/meeting';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoaWJhQGdtYWlsLmNvbSIsImlhdCI6MTc0NTUzMTI4MSwiZXhwIjoxNzQ1NjM5MjgxfQ.r6r4xbIILydy6e7E8Q9Xdje4KcodUjtI8qbMe_rQYBo'; // ou mettre manuellement : 'Bearer eyJhbGci...'
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllMeetings(): Observable<Meeting[]> {
    console.log(this.getAuthHeaders());
    return this.http.get<Meeting[]>(`${this.apiUrl}/retrieve-all-meeting`, {
      headers: this.getAuthHeaders()
    });
  }

  retrieveMeeting(meetingId: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/retrieve-meeting/${meetingId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addMeeting(meeting: Meeting): Observable<Meeting> {
    console.log(this.getAuthHeaders);
    return this.http.post<Meeting>(`${this.apiUrl}/add-meeting`, meeting, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-meeting/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/update-meeting`, meeting, {
      headers: this.getAuthHeaders()
    });
  }

  getTopPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-patients`, {
      headers: this.getAuthHeaders()
    });
  }

  getMeetingReminders(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/reminders`, {
      headers: this.getAuthHeaders()
    });
  }

  getAvailableSlots(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available-slots/${date}`, {
      headers: this.getAuthHeaders()
    });
  }
}

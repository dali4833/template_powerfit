import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeetingComponent } from '../nutritionist/meeting/meeting.component';

export interface Meeting {
  id: number;
  patientName: string;
  date: Date;  // correspond à une date complète (date + heure)
  
  status: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8089/meeting';

  constructor(private http: HttpClient) {}
  //  Get all meetings
  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/retrieve-all-meeting`);

  }

  //RetreiveMeetingById
  retrieveMeeting(meetingId: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/retrieve-meeting/${meetingId}`);
  } 

  //  Add new meeting
  addMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.apiUrl}/add-meeting`, meeting);
  }

  //  Delete meeting
  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-meeting/${id}`);
  }

  //  Update meeting
  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/update-meeting`, meeting);
  }

  //stat des patients 
  getTopPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-patients`);
  }
  getMeetingReminders(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/reminders`);
  }
    

  
  getAvailableSlots(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available-slots/${date}`);
  }
  
  
}

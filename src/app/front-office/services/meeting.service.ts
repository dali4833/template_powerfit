import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
import {environment} from "../../../environments/environment";


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
  private apiUrl = `${environment.apiUrl}/meeting`;

  constructor(private http: HttpClient,private authService: AuthService) {}

  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllMeetings(): Observable<any[]> {
     return from(this.generateHeaders()).pipe(
          switchMap(headers =>
            this.http.get<any[]>(`${this.apiUrl}/retrieve-all-meeting`, { headers })
          )
        );

  }

  retrieveMeeting(meetingId: number): Observable<any> {

  return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-meeting/${ meetingId }`,{ headers } )
      )
    );

  }

  addMeeting(meeting: Meeting): Observable<any> {


    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-meeting`, meeting, { headers })
      )
    );
  }

  deleteMeeting(id: number): Observable<void> {

    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-meeting/${id}`, { headers })
      )
    );
  }

  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<Meeting>(`${this.apiUrl}/update-meeting`, meeting, { headers })
      )
    );
  }

  getMeetingReminders(): Observable<Meeting[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<Meeting[]>(`${this.apiUrl}/reminders`, { headers })
      )
    );
  }

  getAvailableSlots(date: string): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/available-slots/${date}`, { headers })
      )
    );
  }




}

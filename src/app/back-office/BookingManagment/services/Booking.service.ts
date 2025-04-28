import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `http://localhost:8089/training-sessions`;


  constructor(
    private http: HttpClient,
    private authService: AuthService 

  ) { }





  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBookings(sessionId: number): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/${sessionId}/bookings/retrieve-Bookings`, { headers })
      )
    );
  }

  createBooking(sessionId: number): Observable<any> {

    return from(this.generateHeaders()).pipe(
      switchMap(headers => {
        console.log(headers);
        return this.http.post<any>(`${this.apiUrl}/${sessionId}/bookings`, {}, { headers });
      })
    );
  }

  approveBooking(sessionId: number, bookingId: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.patch<any>(
          `${this.apiUrl}/${sessionId}/bookings/${bookingId}/approve`,
          null,
          { headers }
        )
      )
    );
  }

  rejectBooking(sessionId: number, bookingId: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.patch<any>(
          `${this.apiUrl}/${sessionId}/bookings/${bookingId}/reject`,
          null,
          { headers }
        )
      )
    );
  }

  cancelBooking(sessionId: number, bookingId: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/${sessionId}/bookings/${bookingId}`, { headers })
      )
    );
  }


  getTrainingSessions(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-TrainingSessions`, { headers })
      )
    );
  }


  getBookingsByCoachId() : Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/getCoachBookings`, { headers })
      )
    );
  }

}

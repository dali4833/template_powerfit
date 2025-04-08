import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/auth';

  constructor(private http: HttpClient) {}

// src/app/services/auth.service.ts
login(user: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/generateToken`, user, {
    responseType: 'text'  // <--- This is important!
  }).pipe(
    tap((token: string) => {
      localStorage.setItem('token', token);
      console.log('JWT Token saved:', token);
    })
  );
}


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewUser`, user, {
      responseType: 'text' as 'json' // 👈 tell Angular to treat response as plain text
    });
  }


  getUserProfile(): Observable<string> {
    const token = localStorage.getItem('token');
  
    return this.http.get(`${this.apiUrl}/user/userProfile`, {
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  

}

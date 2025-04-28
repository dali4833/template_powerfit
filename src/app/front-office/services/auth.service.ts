import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8087/auth';

  constructor(private http: HttpClient,private router: Router ) {}

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


  logout() {
    const token = localStorage.getItem('token');

    if (token) {
      this.http.post('http://localhost:8080/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      }).subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error('Logout error', err),
        complete: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
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



  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, {
      responseType: 'text'
    });
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("Token sent:", token);
    return this.http.get<any>(`${this.apiUrl}/userDetails`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }, {
      responseType: 'text'
    });
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}


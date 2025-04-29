import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/auth';

  constructor(private http: HttpClient, private router: Router) {
  }

// src/app/services/auth.service.ts
  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generateToken`, user).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          console.log('JWT Token saved:', res.token);
        }
      })
    );
  }
//login(user: any): Observable<any> {
  //return this.http.post(`${this.apiUrl}/generateToken`, user, {
  //  responseType: 'text'  // <--- This is important!
 // }).pipe(
  //  tap((token: string) => {
   //   localStorage.setItem('token', token);
    //  console.log('JWT Token saved:', token);
   // })
//  );
//}


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewUser`, user, {
      responseType: 'text' as 'json' // 👈 tell Angular to treat response as plain text
    });
  }


  logout() {
    localStorage.removeItem('token'); // or sessionStorage
    //navigate to login page
    this.router.navigate(['/login']);

  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/owner/userProfile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }



  getUserProfileBsic(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.apiUrl}/userProfile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }

    });
  }

  addUserToClub(userInfo: any, clubId: number): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(
      `http://localhost:8089/auth/owner/add-to-club?clubId=${clubId}`,
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'text'
      }
    );
  }

  generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }


  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found.');
      return null;
    }

    try {
      const payloadPart = token.split('.')[1];
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      const payload = JSON.parse(decodedPayload);

      console.log('Token payload:', payload);

      if (payload.roles && Array.isArray(payload.roles)) {
        // Check for ROLE_ADMIN first
        if (payload.roles.includes('ROLE_ADMIN')) {
          return 'ROLE_ADMIN';
        }
        // Then check for ROLE_COACH
        if (payload.roles.includes('ROLE_COACH')) {
          return 'ROLE_COACH';
        }
      }

      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
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



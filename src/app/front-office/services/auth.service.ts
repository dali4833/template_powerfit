import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from "../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,private router: Router) {}

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
      `${environment.apiUrl}/auth/owner/add-to-club?clubId=${clubId}`,
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
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/'); // handle base64url
      const decodedPayload = atob(base64);
      const payload = JSON.parse(decodedPayload);

      let role = null;
      if (Array.isArray(payload.roles)) {
        role = payload.roles[0]; // 👈 pick the first role
      } else {
        role = payload.roles;
      }

      console.log('Role from token:', role);
      return role || null;
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

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("Token sent:", token);
    return this.http.get<any>(`${this.apiUrl}/userDetails`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}







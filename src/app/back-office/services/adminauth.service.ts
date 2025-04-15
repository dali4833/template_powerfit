import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AdminauthService {
  private apiUrl = 'http://localhost:8089/auth';

  constructor(private http: HttpClient,private router: Router) {}

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


getAllUsers() {
  return this.http.get<any[]>(`${this.apiUrl}/admin/getAllUsers`);
}

deleteUserById(id: number) {
  return this.http.delete(`${this.apiUrl}/admin/deleteUser/${id}`);
}

}

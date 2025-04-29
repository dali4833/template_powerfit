import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AdminauthService {
  private apiUrl = 'http://localhost:8089/auth';

  constructor(private http: HttpClient, private router: Router) { }

// login(user: any): Observable<any> {
//   return this.http.post(`${this.apiUrl}/generateToken`, user, {
//     responseType: 'text'  // <--- This is important!
//   }).pipe(
//     tap((token: string) => {
//       localStorage.setItem('token', token);
//       console.log('JWT Token saved:', token);
//     })
//   );
// }




login(user: any): Observable<string> {
  return this.http.post<any>(`${this.apiUrl}/generateToken`, user).pipe(
    tap((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        console.log('JWT Token saved:', res.token);
      }
    }),
    map(res => res.token) // <--- extract just the token
  );
}




getAllUsers() {
  const token = localStorage.getItem('token');
  return this.http.get<any[]>(`${this.apiUrl}/admin/getAllUsers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  }

deleteUserById(id: number) {
  const token = localStorage.getItem('token');
  return this.http.delete(`${this.apiUrl}/admin/deleteUser/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`    
}
  });
}


toggleBlockStatus(id: number, block: boolean) {
  return this.http.put(`${this.apiUrl}/admin/blockUser/${id}?block=${block}`, {});
}


}

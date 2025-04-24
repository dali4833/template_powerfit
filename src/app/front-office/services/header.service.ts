import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() {}

  getHeader() {
    const auth_token =
      localStorage.getItem('token') ||
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJub3Nub3NAZ21haWwuY29tIiwiaWF0IjoxNzQ1NTIwOTgyLCJleHAiOjE3NDU2Mjg5ODJ9.A_Pjcm6F42qk8bf9p3uQarDZRDc6fh8TT2OEw-Zzn4s';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return headers;
  }
}

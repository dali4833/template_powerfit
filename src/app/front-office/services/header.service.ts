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
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJub3Nub3NAZ21haWwuY29tIiwiaWF0IjoxNzQ1MzY3MDAwLCJleHAiOjE3NDU0NzUwMDB9.5U-nUdPypOQxiaxxl79llY0YJKoPqMchwVfusKQxsEQ';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return headers;
  }
}

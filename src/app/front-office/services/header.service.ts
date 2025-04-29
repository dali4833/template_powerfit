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
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJub3Nub3NAZ21haWwuY29tIiwiaWF0IjoxNzQ1NTMwMDg4LCJleHAiOjE3NDU2MzgwODh9.1HIgoARMDN-N8aPxpwS7E0P6kNsjnKRDsmH1BuiU1Jc';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return headers;
  }
}

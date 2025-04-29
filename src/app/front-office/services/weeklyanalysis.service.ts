import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeeklyAnalytics } from '../nutrition/models/WeeklyAnalytics'; 
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class WeeklyAnalyticsService {
  private apiUrl = 'http://localhost:8089/analytics';

  constructor(private http: HttpClient,
    private headerService: HeaderService
  ) { }

  getAllWeeklyAnalytics(): Observable<WeeklyAnalytics[]> {
    return this.http.get<WeeklyAnalytics[]>(`${this.apiUrl}/getanalysis`,{
      headers: this.headerService.getHeader(),
    });
  }
}

// exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseRecommendationService {
  private apiUrl = 'http://localhost:8000'; // Update with your FastAPI URL

  constructor(private http: HttpClient) { }

  getRecommendations(target: string, level: string, equipment: string, limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommend`, {
      params: {
        target,
        level,
        equipment,
        limit: limit.toString()
      }
    });
  }
}

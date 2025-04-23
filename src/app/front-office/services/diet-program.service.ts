import { Injectable } from '@angular/core';
import { DietProgram } from '../nutrition/models/DietProgram';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DietProgramService {

  private apiUrl = 'http://localhost:8089/Powfit/dietprogram';

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  //trécuperi  les diet programs kolhom
  getAll(): Observable<DietProgram[]> {
    return this.http.get<DietProgram[]>(`${this.apiUrl}/retrieveAllDietPrograms`,{
      headers: this.headerService.getHeader()
    });
  }

  // trécupéri un diet program hasb l ID
  getById(id: number): Observable<DietProgram> {
    return this.http.get<DietProgram>(`${this.apiUrl}/retrieveDietProgram/${id}`,{
      headers: this.headerService.getHeader()
    });
  }

  // tajouty un diet program
  create(dietProgram: DietProgram): Observable<any> {
    return this.http.post(`${this.apiUrl}/addDietProgram`, dietProgram, { responseType: 'text' });
  }

  // tmodiodifi un diet program
  update(dietProgram: DietProgram): Observable<any> {
    return this.http.put(`${this.apiUrl}//updateDietProgram`, dietProgram, { responseType: 'text' });
  }

  // tsupprimy un diet program
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeDietProgram/${id}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tajouty plusieurs diet programs
  addMany(dietPrograms: DietProgram[]): Observable<DietProgram[]> {
    return this.http.post<DietProgram[]>(`${this.apiUrl}/addManyDietPrograms`, dietPrograms,{
      headers: this.headerService.getHeader(),
    });
  }

  // trécuperi hasb l userId (func lel nutritionist )
  findByUserId(userId: number): Observable<DietProgram[]> {
    return this.http.get<DietProgram[]>(`${this.apiUrl}/findByUserId?userId=${userId}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // trécuperie par plusieurs userIds
  findByMultipleUserIds(userIds: number[]): Observable<DietProgram[]> {
    const params = userIds.map(id => `userIds=${id}`).join('&');
    return this.http.get<DietProgram[]>(`${this.apiUrl}/findByMultipleUserIds?${params}`,{
      headers: this.headerService.getHeader(),
    });
  }
}

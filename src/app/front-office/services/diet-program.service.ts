import { Injectable } from '@angular/core';
import { DietProgram, DietProgramRequest } from '../nutrition/models/DietProgram';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DietProgramService {

  private apiUrl = 'http://localhost:8089/dietprogram';

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
  create(dietProgram: DietProgram): Observable<DietProgram> {
    // Crée un DTO DietProgramRequest basé sur le DietProgram
    const dietProgramRequest = this.convertToDietProgramRequest(dietProgram);
    return this.http.post<DietProgram>(`${this.apiUrl}/addDietProgram`, dietProgramRequest, {
      headers: this.headerService.getHeader()
    });
  }

  // tmodiodifi un diet program
  update(dietProgram: DietProgram): Observable<DietProgram> {
    // Crée un DTO DietProgramRequest basé sur le DietProgram
    const dietProgramRequest = this.convertToDietProgramRequest(dietProgram);
    return this.http.put<DietProgram>(`${this.apiUrl}/updateDietProgram`, dietProgramRequest, {
      headers: this.headerService.getHeader()
    });
  }
  // tsupprimy un diet program
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeDietProgram/${id}`,{
      headers: this.headerService.getHeader(),
    });
  }

  // tajouty plusieurs diet programs
  addMany(dietPrograms: DietProgram[]): Observable<DietProgram[]> {
    const dietProgramRequests = dietPrograms.map(program => this.convertToDietProgramRequest(program));
    return this.http.post<DietProgram[]>(`${this.apiUrl}/addManyDietPrograms`, dietProgramRequests, {
      headers: this.headerService.getHeader()
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
    let params = new HttpParams();
    userIds.forEach(id => params = params.append('userIds', id.toString()));
  
    return this.http.get<DietProgram[]>(`${this.apiUrl}/findByMultipleUserIds`, {
      headers: this.headerService.getHeader(),
      params: params
    });
  }
    // tconverty e diet programm l dietprogram request (aka dto)
    private convertToDietProgramRequest(dietProgram: DietProgram): DietProgramRequest {
      const creationDate = dietProgram.creationDate 
        ? dietProgram.creationDate.toISOString().split('T')[0]  // ken date definis f wakt shyh bel format shyha iso
        : new Date().toISOString().split('T')[0];  //sinon nestaaml lwakt l actuel
    
      return {
        idDiet: dietProgram.idDiet,
        name: dietProgram.name,
        description: dietProgram.description,
        calories: dietProgram.calories,
        duration: dietProgram.duration,
        targetGoal: dietProgram.targetGoal,
        creationDate: creationDate,  
        userUsername: dietProgram.user?.username,
        userEmail: dietProgram.user?.userEmail
      };
    }
    
}

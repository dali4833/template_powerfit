import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/front-office/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = `http://localhost:8089/packs`;
  private cachedToken: string | null = null;

 
 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  
  private async generateHeaders(): Promise<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }




  getpacks(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers => 
        this.http.get<any[]>(`${this.apiUrl}/retrieve-all-packs`, { headers })
      )
    );
  }

  getpack(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/retrieve-pack/${id}`, { headers })
      )
    );
  }

  createPack(pack: any): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.post<any>(`${this.apiUrl}/add-pack`, pack, { headers })
      )
    );
  }

  updatepack(pack: any, id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/update-pack/${id}`, pack, { headers })
      )
    );
  }

  deletepack(id: number): Observable<void> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.apiUrl}/remove-pack/${id}`, { headers })
      )
    );
  }

  affecterPackToclub(id: number, idclub: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.put<any>(`${this.apiUrl}/affect-pack/${id}/to-club/${idclub}`, {}, { headers })
      )
    );
  }

  doespackhaveclub(id: number): Observable<any> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any>(`${this.apiUrl}/hasClub/${id}`, { headers })
      )
    );
  }


  getPopularPacks(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/popularity`, { headers })
      )
    );
  }

/*
[  exemple return
    {
        "id": 1,
        "name": "basic",
        "price": 100.0,
        "duration": 120,
        "subscriptionCount": 1,
       
    },
    {
        "id": 2,
        "name": "premium",
        "price": 1000.0,
        "duration": 150,
        "subscriptionCount": 1,
      
    },
    {
        "id": 3,
        "name": "advanced",
        "price": 190.0,
        "duration": 120,
        "subscriptionCount": 1,
    
    },
    {
        "id": 4,
        "name": "testpack",
        "price": 11.0,
        "duration": 123,
        "subscriptionCount": 0,
       
    }
]
*/





  getPacksPopularityStatistics(): Observable<any[]> {
    return from(this.generateHeaders()).pipe(
      switchMap(headers =>
        this.http.get<any[]>(`${this.apiUrl}/statistics`, { headers })
      )
    );
  }

  /*
  {
    "mostPopularPack": "basic",
    "leastPopularPack": "testpack",
    "maxAbonnements": 1,
    "allPacks": [
        {
            "id": 1,
            "name": "basic",
            "price": 100.0,
            "duration": 120,
            "subscriptionCount": 1,
         
        },
        {
            "id": 2,
            "name": "premium",
            "price": 1000.0,
            "duration": 150,
            "subscriptionCount": 1,
       
        },
        {
            "id": 3,
            "name": "advanced",
            "price": 190.0,
            "duration": 120,
            "subscriptionCount": 1,
        
        },
        {
            "id": 4,
            "name": "testpack",
            "price": 11.0,
            "duration": 123,
            "subscriptionCount": 0,
          
        }
    ],
    "totalAbonnements": 3,
    "averageAbonnements": 0.75
}
  
  * */

 


  
}
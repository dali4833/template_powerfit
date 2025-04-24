import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { User } from '../model/User';
import { ChatMessage } from '../model/ChatMessage';
import { AuthService } from 'src/app/front-office/services/auth.service';
const apiUrl = 'http://localhost:8089/training-sessions/';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient , private authService: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiUrl+`users`, {
      headers : this.createAutorizationHeader()
    });
  }
  getChatMessages(recipientId: number): Observable<ChatMessage[]> {
    return this.authService.getCurrentUser().pipe(  // Utilise getCurrentUser() pour obtenir l'utilisateur courant
      switchMap(user => {
        if (user && user.id) {
          return this.http.get<ChatMessage[]>(apiUrl+`messages/${user.id}/${recipientId}`, {
            headers: this.createAutorizationHeader()
          });
        } else {
          throw new Error('User ID is not available');
        }
      })
    );
  }

  sendMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(apiUrl+`chat`, chatMessage , {
      headers : this.createAutorizationHeader()
    });
  }
  createAutorizationHeader():HttpHeaders{
    let authHeaders : HttpHeaders= new HttpHeaders();
    return authHeaders.set(
      "Authorization", "Bearer " + this.authService.getToken()
    )
  }
}

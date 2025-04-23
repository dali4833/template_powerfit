
import { Injectable } from '@angular/core';
import * as Stomp  from "stompjs" ;
import { Subject } from 'rxjs';
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<any>();

  connect() {
    const token = localStorage.getItem('token');

    const socket = new SockJS('http://localhost:8089/ws');
    this.stompClient = Stomp.over(socket);

    const that = this;

    this.stompClient.connect(
      { Authorization: `Bearer ${token}` },
      function (frame: any) {
        console.log('Connected to WebSocket:', frame);
        that.stompClient.subscribe('/user/queue/messages', (message: any) => {
          if (message.body) {
            that.messageSubject.next(JSON.parse(message.body));
          }
        });
      },
      function (error: any) {
        console.error('WebSocket connection error:', error);
      }
    );
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  sendMessage(destination: string, message: any) {
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
}

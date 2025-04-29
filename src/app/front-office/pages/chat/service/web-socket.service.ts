import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { NotificationService } from './NotificationService';
import { ChatNotification } from '../model/ChatNotification';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<any>();

  constructor(private notificationService: NotificationService) {}

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
            const parsedMessage: ChatNotification = JSON.parse(message.body);

            // Push to general message stream
            that.messageSubject.next(parsedMessage);

            // 🔔 Trigger global notification
            that.notificationService.notify(parsedMessage);
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

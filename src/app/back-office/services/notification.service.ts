import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketNotificationService {
  private stompClient!: Client;

  private notifications = new BehaviorSubject<string[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const socket = new SockJS(`${environment.apiUrl}/ws`);

    this.stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
          if (message.body) {
            const currentNotifications = this.notifications.getValue();
            this.notifications.next([...currentNotifications, message.body]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    this.stompClient.activate();
  }

  clearNotifications() {
    this.notifications.next([]);
  }
}

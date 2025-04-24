// notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatNotification } from '../model/ChatNotification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private newNotificationSubject = new Subject<ChatNotification>();

  notification$ = this.newNotificationSubject.asObservable();

  notify(notification: ChatNotification) {
    this.newNotificationSubject.next(notification);
  }
}

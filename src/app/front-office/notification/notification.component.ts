// notification.component.ts
import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications"
           class="notification {{notification.type}}">
        <i class="fas fa-check-circle"></i>
        <span>{{notification.message}}</span>
        <button (click)="dismiss(notification.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      bottom: 20px; /* Changed to bottom */
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
    }

    .notification {
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      background-color: #4CAF50;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
      animation: slideIn 0.3s ease-out;
    }

    .notification i {
      font-size: 1.2rem;
    }

    .notification button {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 15px;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  notifications: any[] = []; // Added notifications array

  constructor(private notificationService: NotificationService) {
    // Subscribe to notifications if your service provides them
    // Or implement your notification collection logic here
  }

  dismiss(id: number): void { // Added dismiss method
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}

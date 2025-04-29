import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: { id: number; message: string; type: string }[] = [];
  private nextId = 1;

  showSuccess(message: string): void {
    this.addNotification(message, 'success');
  }

  showLoginRequired(): void {
    this.addNotification('You first need to log in.', 'error'); // Error notification
  }

  private addNotification(message: string, type: 'success' | 'error'): void {
    const notification = { id: this.nextId++, message, type };
    this.notifications.push(notification);
    this.renderNotification(notification);

    // Auto dismiss after 3 seconds
    setTimeout(() => this.removeNotification(notification.id), 3000);
  }

  private renderNotification(notification: { id: number; message: string; type: string }): void {
    const container = document.querySelector('.notification-container') || this.createContainer();
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${notification.type}`;
    notificationElement.innerHTML = `
      <i class="${notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
      <span>${notification.message}</span>
      <button onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(notificationElement);

    // Fade out effect
    setTimeout(() => {
      notificationElement.classList.add('fade-out');
      setTimeout(() => notificationElement.remove(), 300);
    }, 3000);
  }

  private removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
  }

  showError(message: string): void {
    window.alert('⚠ Error: ' + message);
  }
}

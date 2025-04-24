import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChatNotification} from "./front-office/pages/chat/model/ChatNotification";
import {NotificationService} from "./front-office/pages/chat/service/NotificationService";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'powerFit';
  constructor(private snackBar: MatSnackBar, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((notif: ChatNotification) => {
      this.snackBar.open(`New message from user ${notif.senderId}: ${notif.content}`, 'Dismiss', {
        duration: 5000
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html'
})
export class UserprofileComponent implements OnInit {
  profileMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (msg) => {
        this.profileMessage = msg;
      },
      error: (err) => {
        console.error(err);
        this.profileMessage = 'Failed to load profile.';
      }
    });
  }
}

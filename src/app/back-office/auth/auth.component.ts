import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminauthService } from '../services/adminauth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private authService: AdminauthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (token: string) => {
        const decodedToken: any = jwtDecode(token);

        // Check if the token has roles and includes ROLE_ADMIN or ROLE_COACH
        if (decodedToken && (decodedToken.roles?.includes('ROLE_ADMIN') || decodedToken.roles?.includes('ROLE_COACH'))) {
          this.router.navigate(['/admin']); // Navigate to dashboard
        } else {
          alert('Access denied: You are not authorized');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid credentials. Please try again.');
      }
    });
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../front-office/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  isCoach(): boolean {
    const role = this.authService.getRoleFromToken();
    console.log('Sidebar role (Coach check):', role);
    return role === 'ROLE_COACH';
  }

  isAdmin(): boolean {
    const role = this.authService.getRoleFromToken();
    console.log('Sidebar role (Admin check):', role);
    return role === 'ROLE_ADMIN';
  }

}

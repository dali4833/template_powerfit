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
  collapsed: boolean = false;

  menuItems = [
    {

      name: 'Nutrionnist', label: 'Nutrionnist', link: '/admin/nutrionnist', icon: 'bx bx-home-circle', submenu: []
    },

  ];
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  isAdmin(): boolean {
    const role = this.authService.getRoleFromToken();
    console.log('Sidebar role (Admin check):', role);
    return role === 'ROLE_ADMIN';
  }

  hasRole(): boolean {
    const roles = this.authService.getRoleFromToken();
    console.log('Current role:', roles);
    return roles !== null;
  }
}

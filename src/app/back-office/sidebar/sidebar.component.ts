import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  collapsed: boolean = false;

  menuItems = [
    {

      name: 'Nutrionnist', label: 'Nutrionnist', link: '/admin/nutrionnist', icon: 'bx bx-home-circle', submenu: []
    },

  ];
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}

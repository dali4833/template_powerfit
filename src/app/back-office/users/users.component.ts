import { Component, OnInit } from '@angular/core';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: AdminauthService ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to fetch users', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  editUser(user: any) {
    console.log('Editing user:', user);
    // Trigger modal or navigate to edit page
  }
}

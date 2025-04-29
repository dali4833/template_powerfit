import { Component, OnInit } from '@angular/core';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isSortedBySessions: boolean = false;

  constructor(private userService: AdminauthService) {}

  ngOnInit() {
    this.loadUsers();
  }


  toggleBlockUser(user: any) {
    const newStatus = !user.isBlocked;
    this.userService.toggleBlockStatus(user.id, newStatus).subscribe({
      next: () => {
        user.isBlocked = newStatus;
        const msg = newStatus ? 'User has been blocked.' : 'User has been unblocked.';
        alert(msg);
      },
      error: (err) => {
        console.error('Failed to update block status', err);
        alert('Error updating block status.');
      }
    });
  }
  

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];  // Initially, users are shown as they are fetched
      },
      error: (err) => console.error('Failed to fetch users', err),
    });
  }

  // Sort users by session count
  sortUsersBySessions() {
    this.filteredUsers = [...this.users].sort((a, b) => b.sessions - a.sessions);  // Sort by sessions (descending)
  }

  // Toggle filter checkbox
  onFilterChange(event: any) {
    if (event.target.checked) {
      this.isSortedBySessions = true;
      this.sortUsersBySessions();  // Sort by sessions when checkbox is checked
    } else {
      this.isSortedBySessions = false;
      this.filteredUsers = [...this.users];  // Return to original order when checkbox is unchecked
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Delete failed', err),
      });
    }
  }
}

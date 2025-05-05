import { Component, OnInit } from '@angular/core';
import { AdminauthService } from '../services/adminauth.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isSortedBySessions: boolean = false;
  activeDropdownId: number | null = null;

  // Statistics
  totalUsers: number = 0;
  activeUsers: number = 0;
  blockedUsers: number = 0;
  averageSessions: number = 0;
  mostActiveUser: any = null;

  // Chart configurations
  public rolesChartType: ChartType = 'pie';
  public sessionsChartType: ChartType = 'bar';

  public rolesChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ]
    }]
  };

  public sessionsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Number of Sessions',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private userService: AdminauthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  toggleDropdown(userId: number) {
    this.activeDropdownId = this.activeDropdownId === userId ? null : userId;
  }

  isDropdownOpen(userId: number): boolean {
    return this.activeDropdownId === userId;
  }

  calculateStatistics() {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => user.enabled && !user.isBlocked).length;
    this.blockedUsers = this.users.filter(user => user.isBlocked).length;

    const totalSessions = this.users.reduce((sum, user) => sum + (user.sessions || 0), 0);
    this.averageSessions = this.totalUsers > 0 ? totalSessions / this.totalUsers : 0;

    this.mostActiveUser = this.users.reduce((max, user) =>
        (user.sessions || 0) > (max.sessions || 0) ? user : max,
      { sessions: 0 }
    );

    // Prepare chart data
    this.prepareRolesChartData();
    this.prepareSessionsChartData();
  }

  prepareRolesChartData() {
    const roleCounts = this.users.reduce((acc, user) => {
      const role = user.roles || 'No Role';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.rolesChartData.labels = Object.keys(roleCounts);
    this.rolesChartData.datasets[0].data = Object.values(roleCounts);
  }

  prepareSessionsChartData() {
    // Sort users by sessions and take top 5
    const topUsers = [...this.users]
      .sort((a, b) => (b.sessions || 0) - (a.sessions || 0))
      .slice(0, 5);

    this.sessionsChartData.labels = topUsers.map(user => user.name);
    this.sessionsChartData.datasets[0].data = topUsers.map(user => user.sessions || 0);
  }

  toggleBlockUser(user: any) {
    const newStatus = !user.isBlocked;
    this.userService.toggleBlockStatus(user.id, newStatus).subscribe({
      next: () => {
        user.isBlocked = newStatus;
        this.calculateStatistics();
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
        this.filteredUsers = [...this.users];
        this.calculateStatistics();
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

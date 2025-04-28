import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MeetingService } from '../../services/meeting.service';
import { Meeting } from '../../models/Meeting';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  currentChildRoute: boolean = false;
  meetings: Meeting[] = [];
  allMeetings: Meeting[] = [];
  statusFilter: string = '';
  activeTab: string = 'meetings';
  reminders: Meeting[] = [];

  selectedDate: string = ''; 
  slots: any[] = [];

  selectedMeeting!: Meeting;
  error = '';
  successMessage = '';
  showAlert = false;
  alertType = 'success';
  selectedMeetingId: number | null = null;
  topPatients: any[] = [];
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit() {
    this.updateChildRouteVisibility(this.router.url);
    this.refreshData();
    

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateChildRouteVisibility(event.urlAfterRedirects);
        if (event.urlAfterRedirects === '/nutritionist/meeting') {
          this.refreshData();
        }
      }
    });

    setInterval(() => this.checkForUpcomingMeetings(), 60000);
    this.getReminders();

    
    
  }

  updateChildRouteVisibility(url: string) {
    this.currentChildRoute =
      url.includes('addMeeting') ||
      url.includes('showMeeting') ||
      url.includes('updateMeeting');
  }

  goToNewMeeting() {
    this.router.navigate(['addMeeting'], { relativeTo: this.route });
  }

  goToShowMeeting(id?: number): void {
    if (id !== undefined) {
      this.router.navigate(['/nutritionist/meeting/showMeeting', id]);
    }
  }

  editMeeting(id: number) {
    this.router.navigate(['updateMeeting', id], { relativeTo: this.route });
  }

  getMeetings(): void {
    this.meetingService.getAllMeetings().subscribe(
      (data) => {
        this.allMeetings = data;
        this.meetings = data;
        
      },
      (error) => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  applyFilters() {
    this.meetings = this.allMeetings.filter((meeting: Meeting) => {
      if (this.statusFilter) {
        return meeting.status.trim().toLowerCase() === this.statusFilter.trim().toLowerCase();
      }
      return true;
    });
  }

  

  refreshData(): void {
    this.getMeetings(); // ← ce get recharge aussi les top patients
  }

  checkForUpcomingMeetings(): void {
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);

    this.meetings.forEach(meeting => {
      const meetingDate = new Date(meeting.date);
      const timeDiff = Math.abs(meetingDate.getTime() - thirtyMinutesLater.getTime());
      const diffInMinutes = Math.floor(timeDiff / (1000 * 60));
      if (diffInMinutes <= 1) {
        window.alert(`🔔 Rappel : Vous avez un rendez-vous avec ${meeting.patientName} à ${meetingDate.toLocaleTimeString()}`);
      }
    });
  }

  

  cancelDelete(id: number): void {
    document.getElementById('confirmDeleteModal' + id)?.classList.remove('show');
    document.getElementById('confirmDeleteModal' + id)?.setAttribute('style', 'display: none;');
    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');
    document.getElementById('backdrop')?.classList.remove('modal-backdrop', 'fade', 'show');
  }

  deleteMeeting(id?: number): void {
    if (id === undefined) return;

    this.meetingService.deleteMeeting(id).subscribe({
      next: () => {
        this.showSuccessAlert('Meeting deleted successfully');
        this.cancelDelete(id);
        this.refreshData(); // ← recharge les données après suppression
      },
      error: (err) => {
        this.showErrorAlert('Failed to delete meeting');
        console.error('Error deleting meeting:', err);
        this.cancelDelete(id);
      }
    });
  }
  

confirmDelete(): void {
  if (this.selectedMeetingId !== null) {
    this.deleteMeeting(this.selectedMeetingId);
    this.selectedMeetingId = null;
  }
}



  showSuccessAlert(message: string): void {
    this.successMessage = message;
    this.alertType = 'success';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  showErrorAlert(message: string): void {
    this.error = message;
    this.alertType = 'danger';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  formatTime(time: string): string {
    if (!time) return 'N/A';
    return time.substring(0, 5);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  }
  goToMeetings() {
    this.activeTab = 'meetings';
    this.router.navigate(['/nutritionist/meeting']);
  }
  
  goToMedicalFolder() {
    this.activeTab = 'folder';
    this.router.navigate(['/nutritionist/medicalfolder']);
  }
  getReminders() {
    this.meetingService.getMeetingReminders().subscribe((data: Meeting[]) => {
      this.reminders = data;
    });
  }
  loadSlots() {
    if (this.selectedDate) {
      this.meetingService.getAvailableSlots(this.selectedDate).subscribe(data => {
        this.slots = data;
      });
    }
  }
  scheduleMeetingAt(time: string) {
    const datetime = `${this.selectedDate}T${time}`;
    const qp = this.route.snapshot.queryParams;
    this.router.navigate(['addMeeting'], {
      relativeTo: this.route,
      queryParams: {
        dossierId: qp['patientId'],   
        patientName: qp['patientName'],
        datetime
      },
      queryParamsHandling: 'merge'
    });
  }
  
  
  // Pagination
currentPage: number = 1;
itemsPerPage: number = 5;

get paginatedMeetings() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.meetings.slice(start, end);
}

get totalPages(): number {
  return Math.ceil(this.meetings.length / this.itemsPerPage);
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

  
}

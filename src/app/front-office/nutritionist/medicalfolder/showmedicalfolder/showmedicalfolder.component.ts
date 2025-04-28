import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalFolder, MedicalfolderService ,Meeting} from 'src/app/front-office/services/medicalfolder.service';

@Component({
  selector: 'app-showmedicalfolder',
  templateUrl: './showmedicalfolder.component.html',
  styleUrls: ['./showmedicalfolder.component.css']
})
export class ShowmedicalfolderComponent implements OnInit {
  folderId: number = 0;
  medicalFolderData?: MedicalFolder;
  meetings: Meeting[] = []; 
  selectedMedicalFolderId: number | null = null;

  showAlert = false;
  alertType = '';
  successMessage = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalfolderService: MedicalfolderService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.folderId = Number(idParam);
      this.loadMedicalFolder();
      this.loadMeetings();
    } else {
      console.error('❌ ID du dossier manquant dans la route !');
    }
  }

  loadMedicalFolder(): void {
    this.medicalfolderService.getMedicalFolderById(this.folderId).subscribe(
      (data: MedicalFolder) => {
        this.medicalFolderData = data;
        console.log('🟢 Dossier médical chargé :', data);
      },
      (error) => {
        console.error('🔴 Erreur lors de la récupération du dossier médical :', error);
      }
    );
  }
  loadMeetings(): void {
    this.medicalfolderService.getMeetingsByFolderId(this.folderId).subscribe(
      data => this.meetings = data,
      err  => console.error('Erreur loading meetings', err)
    );
  }

  deleteMedicalFolder(id: number): void {
    this.medicalfolderService.deleteDossier(id).subscribe({
      next: () => {
        this.showSuccessAlert('Medical folder deleted successfully');
        this.selectedMedicalFolderId = null;
        // Rediriger vers la liste après suppression
        this.router.navigate(['/nutritionist/medicalfolder']);
      },
      error: (err) => {
        this.showErrorAlert('Failed to delete medical folder');
        console.error('❌ Erreur de suppression :', err);
        this.selectedMedicalFolderId = null;
      }
    });
  }

  showSuccessAlert(message: string): void {
    this.successMessage = message;
    this.alertType = 'success';
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 5000);
  }

  showErrorAlert(message: string): void {
    this.error = message;
    this.alertType = 'danger';
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 5000);
  }
  goToUpdate(id: number) {
    this.router.navigate(['/nutritionist/medicalfolder/update', id]);
  }
  goToAddMeeting(): void {
    if (this.medicalFolderData?.id) {
      this.router.navigate(['/nutritionist/meeting/'], {
        queryParams: {
          patientId: this.medicalFolderData.id,
          patientName: this.medicalFolderData.patientName
        }
      });
    }
  }
  
  
  
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalfolderService, MedicalFolder } from 'src/app/front-office/services/medicalfolder.service';

@Component({
  selector: 'app-updatemedicalfolder',
  templateUrl: './updatemedicalfolder.component.html',
  styleUrls: ['./updatemedicalfolder.component.css']
})
export class UpdatemedicalfolderComponent implements OnInit {
  form!: FormGroup;
  medicalFolderId!: number;
  medicalFolder!: MedicalFolder;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicalFolderService: MedicalfolderService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.medicalFolderId = +idParam;
      this.loadMedicalFolder();
    }
  }

  loadMedicalFolder(): void {
    this.medicalFolderService.getMedicalFolderById(this.medicalFolderId).subscribe({
      next: (data) => {
        this.medicalFolder = data;
        this.initForm();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du dossier médical :', err);
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      patientName: [this.medicalFolder.patientName],
      patientEmail: [this.medicalFolder.patientEmail],
      patientPhone: [this.medicalFolder.patientPhone],
      birthDate: [this.formatDateToInput(this.medicalFolder.birthDate)],
      gender: [this.medicalFolder.gender],
      reasonForVisit: [this.medicalFolder.reasonForVisit],
      notes: [this.medicalFolder.notes],
      weight: [this.medicalFolder.weight],
      height: [this.medicalFolder.height],
      bmi: [this.medicalFolder.bmi],
      allergies: [this.medicalFolder.allergies],
      medicalHistory: [this.medicalFolder.medicalHistory]
    });
  }

  formatDateToInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedFolder: MedicalFolder = {
        ...this.medicalFolder,
        ...this.form.value
      };

      this.medicalFolderService.updateDossier(updatedFolder).subscribe({
        next: () => {
          console.log('✅ Dossier mis à jour !');
          this.router.navigate(['/nutritionist/medicalfolder']);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour :', err);
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalfolderService, MedicalFolder } from '../../../services/medicalfolder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newmedicalfolder',
  templateUrl: './newmedicalfolder.component.html',
  styleUrls: ['./newmedicalfolder.component.css']
})
export class NewmedicalfolderComponent implements OnInit {
  patientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private medicalfolderService: MedicalfolderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      patientName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zàâçéèêëîïôûùüÿñæœ\s'-]+$/)
      ]],
      
      birthDate: ['', Validators.required],
      gender: ['Female'],
      weight: [null, Validators.required],
      height: [null, Validators.required],
      bmi: [{ value: '', disabled: true }],
      patientPhone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$') // Validation pour 8 chiffres
      ]],
      patientEmail: ['', [Validators.email]],
      allergies: [''],
      medicalHistory: [''],
      reasonForVisit: [''],
      notes: [''],
      createdAt: [new Date()],
      updatedAt: [new Date()]
    });

    // Écoute les changements de poids et de taille pour recalculer le BMI
    this.patientForm.get('weight')?.valueChanges.subscribe(() => this.calculateBMI());
    this.patientForm.get('height')?.valueChanges.subscribe(() => this.calculateBMI());
  }

  calculateBMI(): void {
    const weight = this.patientForm.get('weight')?.value;
    const height = this.patientForm.get('height')?.value;
    if (weight && height && height > 0) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      this.patientForm.get('bmi')?.setValue(bmi.toFixed(1), { emitEvent: false });
    }
  }

  onPhoneInput(event: any): void {
    const input = event.target;
    
    // Supprimer tout sauf les chiffres
    let numbersOnly = input.value.replace(/\D/g, '').slice(0, 8);
    
    // Appliquer le format "12 345 678"
    let formatted = numbersOnly.replace(/(\d{2})(\d{3})(\d{0,3})/, (match: string, p1: string, p2: string, p3: string) => {
      return [p1, p2, p3].filter(Boolean).join(' ');
    });
  
    input.value = formatted;
    this.patientForm.get('patientPhone')?.setValue(numbersOnly, { emitEvent: false }); // garde la valeur brute pour le backend
  }
  onNameInput(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Zàâçéèêëîïôûùüÿñæœ\s'-]/g, '');
    this.patientForm.get('patientName')?.setValue(input.value, { emitEvent: false });
  }
  

  onSubmit(): void {
    if (this.patientForm.valid) {
      const dossier: MedicalFolder = {
        ...this.patientForm.getRawValue(), // getRawValue pour inclure les champs désactivés comme BMI
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.medicalfolderService.addDossier(dossier).subscribe({
        next: () => {
          console.log('Medical folder created successfully');
          this.router.navigate(['/nutritionist/medicalfolder']); // Redirection vers la liste
        },
        error: err => {
          console.error('Error creating medical folder:', err);
        }
      });
    } else {
      console.log('Form not valid');
    }
  }
}

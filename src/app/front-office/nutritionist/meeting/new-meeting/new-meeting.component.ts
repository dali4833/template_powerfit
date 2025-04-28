// new-meeting.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingdossierService } from 'src/app/front-office/services/meetingdossier.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})
export class NewMeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  dossierId!: number;
  patientName!: string;
  datetime!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingdossierService
  ) {}

  ngOnInit(): void {
    // 1) Initialisation du FormGroup
    this.meetingForm = this.fb.group({
      patientName: ['', Validators.required],
      date:        ['', Validators.required],   // contrôle 'date'
      status:      ['', Validators.required],
      notes:       ['']
    });

    // 2) Lecture des queryParams et patch direct
    this.route.queryParams.subscribe(params => {
      this.dossierId   = +params['dossierId'];
      this.patientName = params['patientName'] || '';
      this.datetime    = params['datetime']   || '';  // "2025-04-28T09:30"

      this.meetingForm.patchValue({
        patientName: this.patientName,
        date:        this.datetime   // on injecte directement la valeur datetime
      });
    });
  }

  /** Nettoie le nom au keypress */
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    this.meetingForm.get('patientName')?.setValue(sanitized, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      return alert('Merci de remplir tous les champs obligatoires !');
    }
  
    // Recopie du form value
    const meetingData: any = { ...this.meetingForm.value };
  
    // Ajoute “:00” si on a seulement “YYYY-MM-DDTHH:mm”
    if (meetingData.date && meetingData.date.length === 16) {
      meetingData.date = meetingData.date + ':00';
    }
  
    console.log('Payload envoyé au backend :', meetingData);
  
    this.meetingService
      .addMeetingWithDossier(this.dossierId, meetingData)
      .subscribe(
        () => alert('Réunion créée avec succès !'),
        err => {
          console.error(err);
          //alert('Erreur lors de la création de la réunion.');
        }
      );
  }
}  

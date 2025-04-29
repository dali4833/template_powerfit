import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meeting, MeetingService } from 'src/app/front-office/services/meeting.service';

@Component({
  selector: 'app-updatemeeting',
  templateUrl: './updatemeeting.component.html',
  styleUrls: ['./updatemeeting.component.css']
})
export class UpdatemeetingComponent implements OnInit {
  id!: number;
  meetingForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // 1️⃣ Récupérer l'ID de l'URL
    this.id = +this.route.snapshot.paramMap.get('id')!;

    // 2️⃣ Initialiser le formulaire avec des validations
    this.meetingForm = this.fb.group({
      patientName: ['', Validators.required],
      date: ['', Validators.required], // datetime-local
      status: ['', Validators.required],
      notes: ['']
    });

    // 3️⃣ Charger les données du meeting
    this.meetingService.retrieveMeeting(this.id).subscribe((meeting: Meeting) => {
      console.log("✅ Meeting récupéré :", meeting);
      this.meetingForm.patchValue({
        patientName: meeting.patientName,
        date: this.formatDateTimeLocal(meeting.date), // Convertir la date au bon format
        status: meeting.status,
        notes: meeting.notes
      });
    });
  }

  // 4️⃣ Fonction de mise à jour
  onSubmit(): void {
    if (this.meetingForm.valid) {
      const updatedMeeting: Meeting = {
        id: this.id,
        ...this.meetingForm.value,
        date: new Date(this.meetingForm.value.date) // Convertir la valeur en Date
      };

      this.meetingService.updateMeeting(updatedMeeting).subscribe(() => {
        console.log("✅ Meeting updated successfully!");
        this.router.navigate(['/nutritionist/meeting']);
      }, error => {
        console.error("❌ Error during update:", error);
      });
    } else {
      console.log("❌ Form is invalid");
    }
  }

  // Formater la date au format "YYYY-MM-DDTHH:mm"
  formatDateTimeLocal(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // Format "2025-04-15T13:45"
  }
}

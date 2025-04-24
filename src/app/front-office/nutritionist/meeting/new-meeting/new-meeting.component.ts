import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router for navigation
import { Meeting, MeetingService } from 'src/app/front-office/services/meeting.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})
export class NewMeetingComponent implements OnInit {
  meetingForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,  // Inject MeetingService
    private router: Router , // Inject Router for navigation
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    // Initialiser le formulaire avec des validations
    this.meetingForm = this.fb.group({
      patientName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zàâçéèêëîïôûùüÿñæœ\s'-]+$/)
      ]],
      
      meetingDate: ['', Validators.required],  // DateTime-local
      status: ['', Validators.required],
      notes: ['']
    });
    this.route.queryParams.subscribe(params => {
      if (params['datetime']) {
        this.meetingForm.patchValue({ meetingDate: params['datetime'] });

      }
    });
  }
  onNameInput(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Zàâçéèêëîïôûùüÿñæœ\s'-]/g, '');
    this.meetingForm.get('patientName')?.setValue(input.value, { emitEvent: false });
  }
  

  onSubmit() {
    if (this.meetingForm.valid) {
      const formValue = this.meetingForm.value;
      const newMeeting: Meeting = {
        ...formValue,
        date: new Date(formValue.meetingDate)  // Convertir le datetime-local en objet Date
      };

      this.meetingService.addMeeting(newMeeting).subscribe({
        next: (response) => {
          console.log('Meeting added ✅', response);
          this.router.navigate(['/nutritionist/meeting']);  // Navigate back to meeting list after success
        },
        error: (err) => {
          console.error('Error adding meeting ❌', err);
        }
      });
    }
  }
}

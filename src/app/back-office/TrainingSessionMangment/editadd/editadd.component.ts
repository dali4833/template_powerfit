import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingSessionService } from '../services/TrainingSession.service';

@Component({
  selector: 'app-editadd',
  templateUrl: './editadd.component.html',
  styleUrls: ['./editadd.component.css']
})
export class EditaddComponent implements OnInit {
  sessionForm: FormGroup;
  isEditing = false;
  sessionId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      sport: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.sessionId = +id;
      this.loadSession(this.sessionId);
    }
  }

  loadSession(id: number): void {
    this.trainingSessionService.getTrainingSession(id).subscribe({
      next: (session: any) => {
        this.sessionForm.patchValue(session);
      },
      error: (error) => console.error('Error loading session:', error)
    });
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      const sessionData = this.sessionForm.value;
      sessionData.id = this.sessionId;

      const observable = this.isEditing && this.sessionId
        ? this.trainingSessionService.updateTrainingSession(sessionData)
        : this.trainingSessionService.createTrainingSession(sessionData);

      observable.subscribe({
        next: () => {
          this.router.navigate(['/admin/TrainingSession-management'], { relativeTo: this.route });
        },
        error: (error) => console.error('Error saving session:', error)
      });
    }
  }
}

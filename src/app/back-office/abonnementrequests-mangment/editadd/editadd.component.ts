import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonnementrequestsService } from '../services/Abonnementrequests.service';

@Component({
  selector: 'app-abonnements-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  abonnementForm: FormGroup;
  isEditing = false;
  abonnmentId: number | null = null;
  errorMessage: string = '';
  users: any[] = [];
  packs: any[] = [];


  constructor(
    private fb: FormBuilder,
    private abonnementService: AbonnementrequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.abonnementForm = this.fb.group({
      requestedDate: ['', Validators.required],
      packId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPacks();
  }

  private loadPacks(): void {
    this.abonnementService.getpacks().subscribe({
      next: (packs: any[]) => this.packs = packs,
      error: (error: any) => {
        this.errorMessage = 'Failed to load packs';
        console.error(error);
      }
    });
  }


  onSubmit(): void {
    if (this.abonnementForm.valid) {
      const formValue = this.abonnementForm.value;
      const packId = formValue.packId?.id; // Get the pack id from the selected pack object

      if (!packId) {
        this.errorMessage = 'Please select a valid pack';
        return;
      }
       console.log('Form Value:', packId);
      this.abonnementService.createRequest(packId).subscribe({
        next: () => {
          this.router.navigate(['/admin/abonnementrequests-management/']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to create abonnement request';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonnementService } from '../services/Abonnement.service';

@Component({
  selector: 'app-abonnements-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  abonnementForm: FormGroup;
  isEditing = false;
  abonnmentId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private abonnementService: AbonnementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.abonnementForm = this.fb.group({
      endDate: ['', Validators.required],
      StartDate: ['', Validators.required],
      status: ['', [Validators.required]],
      pack: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.abonnmentId = +id;
      this.isEditing = true;
      this.loadAbonnement(this.abonnmentId);
    }
  }

  private loadAbonnement(id: number): void {
    this.abonnementService.getAbonnement(id).subscribe({
      next: (abonnement) => this.abonnementForm.patchValue(abonnement),
      error: (error) => {
        this.errorMessage = 'Failed to load sport details';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.abonnementForm.valid) {
      const abonnementData: any = this.abonnementForm.value;
      
      const action = this.isEditing ? 
        this.abonnementService.updateAbonnement(abonnementData, this.abonnmentId!) :
        this.abonnementService.createAbonnement(abonnementData);

      action.subscribe({
        next: () => this.router.navigate(['/admin/abonnement-management/']),
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} abonnement`;
          console.error(error);
        }
      });
    }
  }
}

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
  users: any[] = [];
  packs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private abonnementService: AbonnementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.abonnementForm = this.fb.group({
      endDate: ['', Validators.required],
      startDate: ['', Validators.required],
      status: ['pending', [Validators.required]],
      pack: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPacks();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.abonnmentId = +id;
      this.isEditing = true;
      this.loadAbonnement(this.abonnmentId);
    }
  }

  private loadUsers(): void {
    this.abonnementService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        console.error(error);
      }
    });
  }

  private loadPacks(): void {
    this.abonnementService.getpacks().subscribe({
      next: (packs) => this.packs = packs,
      error: (error) => {
        this.errorMessage = 'Failed to load packs';
        console.error(error);
      }
    });
  }

  private loadAbonnement(id: number): void {
    this.abonnementService.getAbonnement(id).subscribe({
      next: (abonnement) => {
        this.abonnementForm.patchValue({
          endDate: abonnement.endDate,
          startDate: abonnement.startDate,
          status: abonnement.status,
          pack: abonnement.pack,
          user: abonnement.user
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load abonnement details';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.abonnementForm.valid) {
      const formValue = this.abonnementForm.value;
      const packId = formValue.pack.id; // Extract just the pack ID
       console.log('Form Value:', packId);
      const action = this.isEditing ? 
        this.abonnementService.updateAbonnement(formValue, this.abonnmentId!) :
        this.abonnementService.createAbonnement(packId); // Send only packId

      action.subscribe({
      //  next: () => this.router.navigate(['/admin/abonnement-management/']),
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} abonnement`;
          console.error(error);
        }
      });
    }
  }
}

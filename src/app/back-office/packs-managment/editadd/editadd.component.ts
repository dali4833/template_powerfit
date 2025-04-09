import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from '../services/pack.service';
import { Sport } from '../models/sport';

@Component({
  selector: 'app-sports-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  sportForm: FormGroup;
  isEditing = false;
  sportId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private sportService: SportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sportForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.sportId = +id;
      this.isEditing = true;
      this.loadSport(this.sportId);
    }
  }

  private loadSport(id: number): void {
    this.sportService.getSport(id).subscribe({
      next: (sport) => this.sportForm.patchValue(sport),
      error: (error) => {
        this.errorMessage = 'Failed to load sport details';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.sportForm.valid) {
      const sportData: Sport = this.sportForm.value;
      
      const action = this.isEditing ? 
        this.sportService.updateSport(sportData, this.sportId!) :
        this.sportService.createSport(sportData);

      action.subscribe({
        next: () => this.router.navigate(['/admin/sports-management/']),
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} sport`;
          console.error(error);
        }
      });
    }
  }
}

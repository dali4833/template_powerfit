import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrophyService } from '../services/Trophy.service';

@Component({
  selector: 'app-trophy-editadd',
  templateUrl: './editadd.component.html',
  styleUrls: ['./editadd.component.css']
})
export class EditaddComponent implements OnInit {
  trophyForm!: FormGroup;
  isEditing = false;
  loading = false;
  errorMessage = '';
  trophyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private trophyService: TrophyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.trophyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      requiredPoints: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.trophyId = +id;
      this.loadTrophy(this.trophyId);
    }
  }

  private loadTrophy(id: number): void {
    this.loading = true;
    this.trophyService.getTrophy(id).subscribe({
      next: (trophy) => {
        this.trophyForm.patchValue(trophy);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load trophy';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.trophyForm.valid) {
      this.loading = true;
      const trophyData = this.trophyForm.value;
      
      const action = this.isEditing ? 
        this.trophyService.updateTrophy(trophyData, this.trophyId!) :
        this.trophyService.createTrophy(trophyData);

      action.subscribe({
        next: () => {
          this.router.navigate(['/admin/Trophy-management']);
        },
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} trophy`;
          this.loading = false;
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from '../services/pack.service';
import { Sport } from '../models/sport';

@Component({
  selector: 'app-sports-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  sportForm: FormGroup;
  isEditing = false;
  sportId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private sportService: SportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sportForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sportId = +this.route.snapshot.params['id'];
    if (this.sportId) {
      this.isEditing = true;
      this.loadSport(this.sportId);
    }
  }

  loadSport(id: number): void {
    this.sportService.getSport(id).subscribe(sport => {
      this.sportForm.patchValue(sport);
    });
  }

  onSubmit(): void {
    if (this.sportForm.valid) {
      const sportData: Sport = this.sportForm.value;
      
      if (this.isEditing && this.sportId) {
        this.sportService.updateSport(sportData, this.sportId).subscribe(() => {
          this.router.navigate(['/sports']);
        });
      } else {
        this.sportService.createSport(sportData).subscribe(() => {
          this.router.navigate(['/sports']);
        });
      }
    }
  }
}

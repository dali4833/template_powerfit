import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from '../services/club.service';

@Component({
  selector: 'app-clubs-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  clubForm: FormGroup;
  isEditing = false;
  clubId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clubservice: ClubService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clubForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
       capacity: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clubId = +this.route.snapshot.params['id'];
    if (this.clubId) {
      this.isEditing = true;
      this.loadClub(this.clubId);
    }
  }

  loadClub(id: number): void {
    this.clubservice.getClub(id).subscribe(club => {
      this.clubForm.patchValue(club);
    });
  }

  onSubmit(): void {
    if (this.clubForm.valid) {
      const clubdata: any = this.clubForm.value;
      
      if (this.isEditing && this.clubId) {
        this.clubservice.updateClub(clubdata, this.clubId).subscribe(() => {
          this.router.navigate(['/admin/clubs-management']);
        });
      } else {
        this.clubservice.createClub(clubdata).subscribe(() => {
          this.router.navigate(['/admin/clubs-management']);
        });
      }
    }
  }
}

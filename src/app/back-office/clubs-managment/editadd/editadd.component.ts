import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from '../services/club.service';

@Component({
  selector: 'app-clubs-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  clubform: FormGroup;
  isEditing = false;
  clubId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clubservice: ClubService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clubform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      capacity: ['', [Validators.required]],
      status: ['', [Validators.required]],
      image: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; 
    if (id) {
      this.clubId = +id;
      this.isEditing = true;
      this.loadclub(this.clubId);
    }
  }
  

  private loadclub(id: number): void {
    this.clubservice.getClub(id).subscribe({
      next: (club) => this.clubform.patchValue(club),
      error: (error) => {
        this.errorMessage = 'Failed to load club details';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.clubform.valid) {
      const clubData = this.clubform.value;
      const formData = new FormData();
  
      formData.append('name', clubData.name);
      formData.append('description', clubData.description);
      formData.append('capacity', clubData.capacity);
      formData.append('status', clubData.status);
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      const action = this.isEditing
        ? this.clubservice.updateClub(formData, this.clubId!)
        : this.clubservice.createClub(formData); // Crée aussi avec image si nécessaire
  
      action.subscribe({
        next: () => this.router.navigate(['/admin/clubs-management']),
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} club`;
          console.error(error);
        }
      });
    }
  }
  
  
  selectedFile: File | null = null;

onFileChange(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
  }
}

}

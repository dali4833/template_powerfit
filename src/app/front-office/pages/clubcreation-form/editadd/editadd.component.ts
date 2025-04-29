import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/back-office/clubs-managment/services/club.service'; // Correction de l'importation du service

@Component({
  selector: 'app-req-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  requestForm: FormGroup;
  isEditing = false;
  sportId: number | null = null;
  errorMessage: string = '';
  documentFile: File | null = null;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private reqService: ClubService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.requestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      capacity: ['', [Validators.required]],
      status: ['PENDING', [Validators.required]]  // Ajout d'une validation pour le statut
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sportId = params['sportId'] || null;
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.documentFile = event.target.files[0];
    }
  }
  onImageChange(event: any): void {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }


  onSubmit(): void {
    if (this.requestForm.valid && this.documentFile) {
      const sportData = this.requestForm.value;

      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(sportData)], { type: 'application/json' }));
      formData.append("document", this.documentFile);
      if (this.imageFile) {
        formData.append("image", this.imageFile);
      }
      this.reqService.submitClubCreationRequest(formData).subscribe({
        next: () => this.router.navigate(['/Clubs/']),
        error: (error) => {
          this.errorMessage = `Failed to create request`;
          console.error(error);
        }
      });
    }
  }


}

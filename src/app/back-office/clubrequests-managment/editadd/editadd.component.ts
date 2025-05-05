import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from '../../clubs-managment/services/club.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-req-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  requestForm: FormGroup;
  isEditing = false;
  sportId: number | null = null;
  errorMessage = '';
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
      status: ['PENDING', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sportId = params['sportId'] || null;
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.documentFile = input.files[0];
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.requestForm.valid && this.documentFile) {
      const formData = new FormData();

      // Prepare the request data
      const requestPayload = {
        name: this.requestForm.value.name,
        description: this.requestForm.value.description,
        capacity: this.requestForm.value.capacity,
        status: this.requestForm.value.status
      };

      // Append JSON data to FormData
      formData.append('request', JSON.stringify(requestPayload));

      // Append the document file
      formData.append('document', this.documentFile);

      // Append the image file if present
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      // Send the form data using the service
      this.reqService.submitClubCreationRequest(formData).subscribe({
        next: () => this.router.navigate(['/admin/clubrequests-management']),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Échec de la création : ${error.error?.message || error.message}`;
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires, y compris le document.';
    }
  }
}

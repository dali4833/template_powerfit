import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubrequestsService } from '../services/Clubrequests.service';
import { ClubService } from '../../clubs-managment/services/club.service';

@Component({
  selector: 'app-req-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  requestForm: FormGroup;
  isEditing = false;
  sportId: number | null = null;
  errorMessage: string = '';

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
      status: ['PENDING']
    });
  }

  ngOnInit(): void {
  
  }



  onSubmit(): void {
    if (this.requestForm.valid) {
      const sportData: any = this.requestForm.value;
      
      const action =  this.reqService.submitClubCreationRequest(sportData);

      action.subscribe({
        next: () => this.router.navigate(['/admin/clubrequests-management/']),
        error: (error) => {
          this.errorMessage = `Failed to create request`;
          console.error(error);
        }
      });
    }
  }
}

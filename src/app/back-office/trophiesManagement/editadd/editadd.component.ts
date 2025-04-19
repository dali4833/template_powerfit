import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrophyService } from '../services/Trophy.service';

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
       private trophyService: TrophyService,
   
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sportForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
   
  }


}

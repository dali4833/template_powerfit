import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from '../services/pack.service';

@Component({
  selector: 'app-packs-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  packForm: FormGroup;
  isEditing = false;
  packId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private packservice: PackService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.packForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.packId = +this.route.snapshot.params['id'];
    if (this.packId) {
      this.isEditing = true;
      this.loadPack(this.packId);
    }
  }

  loadPack(id: number): void {
    this.packservice.getpack(id).subscribe(pack => {
      this.packForm.patchValue(pack);
    });
  }

  onSubmit(): void {
    if (this.packForm.valid) {
      const packData: any = this.packForm.value;
      
      if (this.isEditing && this.packId) {
        this.packservice.updatepack(packData, this.packId).subscribe(() => {
          this.router.navigate(['/admin/packs-management/']);
        });
      } else {
        this.packservice.createPack(packData).subscribe(() => {
          this.router.navigate(['/admin/packs-management/']);
        });
      }
    }
  }
}

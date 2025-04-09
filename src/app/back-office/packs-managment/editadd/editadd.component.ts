import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from '../services/pack.service';

@Component({
  selector: 'app-packs-editadd',
  templateUrl: './editadd.component.html'
})
export class EditaddComponent implements OnInit {
  packForm: FormGroup;
  isEditing = false;
  packId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.packForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.packId = +id;
      this.isEditing = true;
      this.loadPack(this.packId);
    }
  }

  private loadPack(id: number): void {
    this.packService.getpack(id).subscribe({
      next: (pack) => this.packForm.patchValue(pack),
      error: (error) => {
        this.errorMessage = 'Failed to load pack details';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.packForm.valid) {
      const packData: any = this.packForm.value;
      
      const action = this.isEditing ? 
        this.packService.updatepack(packData, this.packId!) :
        this.packService.createPack(packData);

      action.subscribe({
        next: () => this.router.navigate(['/admin/packs-management/']),
        error: (error) => {
          this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'create'} pack`;
          console.error(error);
        }
      });
    }
  }
}

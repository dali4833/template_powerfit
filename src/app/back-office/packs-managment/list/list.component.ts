import { Component, OnInit } from '@angular/core';
import { PackService } from '../services/pack.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packs-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  packs: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private packservice: PackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadpacks();
  }

  loadpacks(): void {
    this.loading = true;
    this.packservice.getpacks().subscribe({
      next: (data) => {
        this.packs = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load packs';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deletePack(id: number): void {
    if (confirm('Are you sure you want to delete this pack?')) {
      this.packservice.deletepack(id).subscribe({
        next: () => {
          this.loadpacks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete pack';
          console.error(error);
        }
      });
    }
  }

  editPack(id: number): void {
    this.router.navigate(['/admin/packs-management', id, 'edit']);
  }
}

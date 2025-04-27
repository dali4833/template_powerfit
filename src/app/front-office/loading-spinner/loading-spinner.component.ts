import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-backdrop" *ngIf="loadingService.loading$ | async">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}

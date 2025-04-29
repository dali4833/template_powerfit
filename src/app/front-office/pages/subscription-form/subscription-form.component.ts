import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  standalone: true,
  styleUrls: ['./subscription-form.component.css']
})
export class SubscriptionFormComponent implements OnInit {
  @Input() packId: number | null = null;

  subscription = {
    startDate: '',
    endDate: ''
  };

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    console.log('ngOnInit called. Pack ID:', this.packId);
  
    if (this.packId) {
      this.subscription = {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      };
  
      this.subscriptionService.subscribeToPack(this.packId, this.subscription).subscribe({
        next: (response) => {
          console.log('Subscription successful:', response);
          alert('Subscription confirmed!');
        },
        error: (error) => {
          console.error('Subscription failed:', error);
          alert('Failed to subscribe. Please try again.');
        }
      });
    }
  }
  

  onSubmit(): void {
    console.log('onSubmit called:', this.subscription); // Vérifiez si cela est appelé automatiquement
    if (this.packId) {
      this.subscriptionService.subscribeToPack(this.packId, this.subscription).subscribe({
        next: (response) => {
          console.log('Subscription successful:', response);
          alert('Subscription confirmed!');
        },
        error: (error) => {
          console.error('Subscription failed:', error);
          alert('Failed to subscribe. Please try again.');
        }
      });
    }
  }
}

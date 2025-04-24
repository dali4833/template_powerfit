import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nutritionist',
  templateUrl: './nutritionist.component.html',
  styleUrls: ['./nutritionist.component.css']
})
export class NutritionistComponent {
  currentChildRoute: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      const child = this.route.firstChild;
      this.currentChildRoute = child?.snapshot.routeConfig?.path || null;
    });
  }

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}

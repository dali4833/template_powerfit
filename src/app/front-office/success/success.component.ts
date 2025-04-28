import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  sessionId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the session_id from the URL
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'] || null;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { TrophyService } from '../services/Trophy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sports-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  sports: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private trophyService: TrophyService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }


}

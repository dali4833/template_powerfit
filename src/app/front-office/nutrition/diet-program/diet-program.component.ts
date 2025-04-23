import { Component, OnInit } from '@angular/core';
import { DietProgram } from '../models/DietProgram';
import { DietProgramService } from '../../services/diet-program.service';

@Component({
  selector: 'app-diet-program',
  templateUrl: './diet-program.component.html',
  styleUrls: ['./diet-program.component.css']
})
export class DietProgramComponent implements OnInit {
  dietPrograms: DietProgram[] = [];
  newDietProgram: DietProgram = new DietProgram();

  constructor(private dietProgramService: DietProgramService) {}

  ngOnInit(): void {
    this.loadDietPrograms();
  }

  // trecuperi diet programs lkol
  loadDietPrograms(): void {
    this.dietProgramService.getAll().subscribe({
      next: (data) => this.dietPrograms = data,
      error: (err) => console.error('loading error sorry', err)
    });
  }

  // add new dietprograam
  addDietProgram(): void {
    this.dietProgramService.create(this.newDietProgram).subscribe({
      next: () => {
        this.newDietProgram = new DietProgram(); 
        this.loadDietPrograms(); 
      },
      error: (err) => console.error('error occurred in the add', err)
    });
  }

  // delete diet program
  deleteDietProgram(id: number): void {
    this.dietProgramService.delete(id).subscribe({
      next: () => this.loadDietPrograms(),
      error: (err) => console.error('Delete error occured', err)
    });
  }

  // Update diet  program
 
 updateDietProgram(): void {
    this.dietProgramService.update(this.newDietProgram).subscribe({
      next: () => {
        this.newDietProgram = new DietProgram();
        this.loadDietPrograms();
      },
      error: (err) => console.error('Error while updating', err)
    });
  }

  
  selectDietProgramForEdit(diet: DietProgram): void {
    this.newDietProgram = { ...diet };
    console.log('Editing diet:', this.newDietProgram);
  }

}
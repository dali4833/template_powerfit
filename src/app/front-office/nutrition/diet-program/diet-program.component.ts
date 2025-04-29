import { Component, OnInit } from '@angular/core';
import { DietProgram } from '../models/DietProgram';
import { DietProgramService } from '../../services/diet-program.service';
import { AuthService } from '../../services/auth.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NutritionService } from 'src/app/front-office/services/nutrition.service';


@Component({
  selector: 'app-diet-program',
  templateUrl: './diet-program.component.html',
  styleUrls: ['./diet-program.component.css']
})
export class DietProgramComponent implements OnInit {
  dietPrograms: DietProgram[] = [];
  newDietProgram: DietProgram = new DietProgram();
  roles :any;
  targetGoals = [
    'WEIGHT_LOSS',
    'WEIGHT_GAIN',
    'MUSCLE_GAIN',
    'MAINTENANCE',
    'FAT_LOSS',
    'IMPROVE_ENDURANCE',
    'IMPROVE_STRENGTH',
    'DETOX',
    'SPORT_PERFORMANCE',
    'HEALTHY_EATING',
    'DIABETES_MANAGEMENT',
    'CHOLESTEROL_CONTROL',
    'VEGAN_DIET',
    'LOW_CARB',
    'HIGH_PROTEIN'
  ];
  currentUser: any;
  selectedGoal: string = '';
  recommendation: any;
  constructor(private dietProgramService: DietProgramService,
    private authService:AuthService,
    private nutritionService: NutritionService) {}
    
  ngOnInit(): void {
    this.loadDietPrograms();
    this.getCurrentUser();
  }
//recomendation
onSelectGoal() {
  if (this.selectedGoal) {
    this.recommendation = null; // Reset avant nouvelle requête
    this.isLoading = true;
    
    this.nutritionService.getRecommendation(this.selectedGoal).subscribe(
      data => {
        this.recommendation = data;
        this.isLoading = false;
        console.log('Recommendation data:', data);
        
        // Si l'API retourne une réponse mais vide
        if (!data || (Object.keys(data).length === 0)) {
          this.recommendation = {
            message: 'No specific recommendations found for this goal. Here are some general tips...',
            generalAdvice: 'Focus on balanced meals, stay hydrated, and maintain regular exercise.'
          };
        }
      },
      error => {
        console.error('Error fetching recommendation', error);
        this.isLoading = false;
        this.recommendation = {
          error: 'Could not load recommendations. Please try again later.'
        };
      }
    );
  }
}
  // trecuperi diet programs lkol
  isLoading = false;
  loadDietPrograms(): void {
    this.isLoading = true;
    this.dietProgramService.getAll().subscribe({
      next: (data) =>{ this.dietPrograms = data;
        this.isLoading = false;
      },
      error: (err) => {console.error('loading error sorry', err);
      this.isLoading = false;}
    });
  }
  //reset
  resetForm(): void {
    this.newDietProgram = new DietProgram();
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
    const confirmation = window.confirm('Are you sure you want to delete this diet program?');
    
    if (confirmation) {
      this.dietProgramService.delete(id).subscribe({
        next: () => this.loadDietPrograms(),
        error: (err) => console.error('Delete error occured', err)
      });
    }
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
  //confiramation 
  confirmUpdate(program: DietProgram): void {
    if (confirm('Are you sure you want to update this diet program?')) {
      this.newDietProgram = { ...program }; 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  confirmUpdateDietProgram(): void {
    if (confirm('Are you sure you want to update this diet program?')) {
      this.updateDietProgram();
    }
  }
  
  

  
  selectDietProgramForEdit(diet: DietProgram): void {
    this.newDietProgram = { ...diet };
    console.log('Editing diet:', this.newDietProgram);
  }
  viewDetails(program: DietProgram) {
    
    console.log(program);
  }
  formatGoal(goal: string): string {
    return goal.replace(/_/g, ' ')
               .toLowerCase()
               .replace(/\b\w/g, c => c.toUpperCase());  // Capitaliser chaque mot
  }  
//impression pdf

printProgram(program: DietProgram): void {
  const doc = new jsPDF();
  const pistachio = [197, 224, 179];
  const darkGreen = [78, 108, 59];

  // Set main title with larger font size and distinct color
  doc.setTextColor(78, 108, 59);
  doc.setFontSize(24); // Increase the font size for the main title
  doc.text('Welcome To Powfit', 14, 25);

  // Set subtitle with a slightly smaller font size
  doc.setFontSize(18); // Slightly smaller font size for subtitle
  doc.text('Diet Program Details', 14, 40);

  // Icons + labels + values
  const details = [
    ['Name', program.name],
    ['Description', program.description],
    ['Calories', `${program.calories} kcal`],
    ['Duration', `${program.duration} month(s)`],
    ['Target Goal', program.targetGoal],
    ['Creation Date', program.creationDate ? new Date(program.creationDate).toLocaleDateString() : 'N/A'],
    ['User', program.user?.username || 'N/A']
  ];

  // Draw table with icons
  const body = details.map(([label, value]) => [label, value]);

  // Add space before the table
  const startY = 50; // More space before the table begins

  autoTable(doc, {
    head: [['Field', 'Value']],
    body: body,
    startY: startY,
    theme: 'grid',
    styles: {
      halign: 'left',
      cellPadding: 4,
      fontSize: 12,
      textColor: [40, 60, 40],
      lineColor: [180, 210, 180]
    },
    headStyles: {
      fillColor: [197, 224, 179], 
      textColor: [50, 70, 50],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Adjusted field width
      1: { cellWidth: 120 } // Adjusted value width
    },
    margin: { top: 20, left: 14, right: 14, bottom: 14 }, // Added margins for better spacing
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Eat healthy. Stay strong.', 14, doc.internal.pageSize.height - 10);

  // Save the PDF with the name of the diet program
  doc.save(`diet-program-${program.name}.pdf`);
}

//men service auth service bch nrecuperie user
getCurrentUser() {
  this.authService.getCurrentUser().subscribe((res) => {
    console.log(res);
    this.roles = res?.user_type;
    this.currentUser = res; // Store the current user
  });
}
//pagination 
pageSize = 3;
currentPage = 1;

get totalPages(): number {
  return Math.ceil(this.dietPrograms.length / this.pageSize);
}

paginatedPrograms() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.dietPrograms.slice(start, start + this.pageSize);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

goToPage(page: number) {
  this.currentPage = page;
}
//aaded for pagination
getPagesArray(): number[] {
  return Array(this.totalPages).fill(0).map((x, i) => i);
}

getFirstItemIndex(): number {
  if (this.dietPrograms.length === 0) return 0;
  return (this.currentPage - 1) * this.pageSize + 1;
}

getLastItemIndex(): number {
  if (this.dietPrograms.length === 0) return 0;
  return Math.min(this.currentPage * this.pageSize, this.dietPrograms.length);
}


  
}
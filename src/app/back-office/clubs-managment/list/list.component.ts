import { Component, OnInit } from '@angular/core';
import { ClubService } from '../services/club.service';
import { SportService } from '../../sports-managment/services/sports.service';
import { AbonnementService } from 'src/app/back-office/abonnement-managment/services/Abonnement.service';
import { Router } from '@angular/router';

interface Club {
  id?: number;
  capacity?: number;
  name?: string;
  description?: string;
  status?: string;
  selectedSportId?: number | null;
  sports?: any[];
}

interface OccupancyData {
  clubId: number;
  occupancyRate: number;
  clubName?: string;
  color?: string;
  degree?: number;
  offset?: number;
}

@Component({
  selector: 'app-clubs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  clubs: Club[] = [];
  sports: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  performanceData: any = null;
  showPerformance: boolean = false;
  
  // New properties for occupancy chart
  occupancyData: OccupancyData[] = [];
  showOccupancyChart: boolean = false;
  selectedSegment: number | null = null;
  
  selectedClubId: number | null = null;
  showPerformanceModal: boolean = false;

  constructor(
    private clubservice: ClubService,
    private sportservice: SportService,
    private abonnementService: AbonnementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClubs();
    this.loadSports();
    this.loadOccupancyData();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubservice.getClubs().subscribe({
      next: (data) => {
        console.log(data);
        this.clubs = data.map(club => ({...club, selectedSportId: null}));
        this.loading = false;
        
        // Match club names to occupancy data if available
        if (this.occupancyData.length > 0) {
          this.prepareOccupancyDataWithNames();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load clubs';
        this.loading = false;
        console.error(error);
      }
    });
  }

  loadSports(): void {
    this.sportservice.getSports().subscribe({
      next: (data) => {
        this.sports = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sports';
        console.error(error);
      }
    });
  }

  loadOccupancyData(): void {
    this.clubservice.getAllClubsOccupancyRate().subscribe({
      next: (data) => {
        this.occupancyData = data;
        console.log('Occupancy data:', this.occupancyData);
        
        if (this.clubs.length > 0) {
          this.prepareOccupancyDataWithNames();
        }
      },
      error: (error) => {
        console.error('Failed to load occupancy data', error);
      }
    });
  }
  
  prepareOccupancyDataWithNames(): void {
    try {
      // Map club names to occupancy data
      this.occupancyData.forEach(item => {
        const club = this.clubs.find(c => c.id === item.clubId);
        item.clubName = club?.name || `Club ${item.clubId}`;
        
        // Generate a color based on club ID
        const hue = (item.clubId * 137) % 360; // Golden ratio approximation for color distribution
        item.color = `hsl(${hue}, 70%, 55%)`;
      });
      
      // Sort by occupancy rate for better visualization
      this.occupancyData.sort((a, b) => b.occupancyRate - a.occupancyRate);
      
      // Calculate conic-gradient degrees and offsets
      let currentOffset = 0;
      const totalValue = this.occupancyData.reduce((sum, item) => sum + item.occupancyRate, 0);
      
      this.occupancyData.forEach(item => {
        // Convert percentage to degrees (out of 360)
        const normalizedValue = totalValue > 0 ? item.occupancyRate / totalValue : 0;
        item.degree = normalizedValue * 360;
        item.offset = currentOffset;
        currentOffset += item.degree;
      });
      
      console.log('Prepared occupancy data:', this.occupancyData);
    } catch (error) {
      console.error('Error preparing occupancy data:', error);
    }
  }
  
  toggleOccupancyChart(): void {
    this.showOccupancyChart = !this.showOccupancyChart;
  }
  
  setSelectedSegment(index: number | null): void {
    this.selectedSegment = index;
  }

  viewPerformance(clubId: number): void {
    console.log('Sending clubId:', clubId);
    this.abonnementService.analyzeClubPerformance(clubId).subscribe({
      next: (data) => {
        this.performanceData = data;
        console.log('Performance:', data);
        this.showPerformance = true;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la performance du club.';
      }
    });
  }

  deleteClub(id: number): void {
    if (confirm('Are you sure you want to delete this club?')) {
      this.clubservice.deleteClub(id).subscribe({
        next: () => {
          this.loadClubs();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete club';
          console.error(error);
        }
      });
    }
  }

  affecttosport(clubId: any, sportId: any): void {
    if (!sportId) {
      this.errorMessage = 'Please select a sport';
      return;
    }

    this.clubservice.affecterSportToClub(clubId, sportId).subscribe({
      next: () => {
        this.loadClubs();
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to affect sport to club';
        console.error(error);
      }
    });
  }

  editClub(id: number): void {
    this.router.navigate(['/admin/clubs-management', id, 'edit']);
  }

  openPerformanceModal(clubId: number) {
    this.selectedClubId = clubId;
    this.showPerformanceModal = true;

    this.abonnementService.analyzeClubPerformance(clubId).subscribe(
      (data) => {
        this.performanceData = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des performances', error);
      }
    );
  }

  closePerformanceModal() {
    this.showPerformanceModal = false;
    this.performanceData = null;
  }

  // Get style for each pie segment - updated method
  getSegmentStyle(index: number): any {
    if (!this.occupancyData[index]) return {};

    const item = this.occupancyData[index];
    const startDeg = item.offset || 0;
    const endDeg = startDeg + (item.degree || 0);
    if (this.occupancyData.length === 1) {
      return {
        'background': `conic-gradient(${item.color} ${startDeg}deg ${endDeg}deg, transparent ${endDeg}deg 360deg)`
      };
    } else {
      const startAngle = item.offset || 0;
      const endAngle = (item.offset || 0) + (item.degree || 0);
      
      // Convert degrees to radians for calculations
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      // Calculate points for the clip path
      const centerX = 50;
      const centerY = 50;
      const startX = centerX + 50 * Math.cos(startRad);
      const startY = centerY + 50 * Math.sin(startRad);
      const endX = centerX + 50 * Math.cos(endRad);
      const endY = centerY + 50 * Math.sin(endRad);
      
      // Determine if the segment is more than half the circle
      const largeArcFlag = item.degree && item.degree > 180 ? 1 : 0;
      
      // Create a polygon clip path
      const clipPath = `path('M ${centerX} ${centerY} L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z')`;
      
      return {
        'backgroundColor': item.color,
        'clipPath': clipPath
      };
    }
  }

  // Add this method to create SVG arc paths
  describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    // Convert degrees to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate the start and end points of the arc
    const startX = x + radius * Math.cos(startRad);
    const startY = y + radius * Math.sin(startRad);
    const endX = x + radius * Math.cos(endRad);
    const endY = y + radius * Math.sin(endRad);
    
    // Determine if we need to draw the large arc (more than 180 degrees)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    // Create the SVG arc path without the center line for a cleaner look
    return `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${x} ${y}
      Z
    `.trim();
  }
}

import { Component, OnInit } from '@angular/core';
import { TrainingSessionService } from '../services/TrainingSession.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  trainingSessions: any[] = [];
  stats: any = null;
  activeTab: string = 'calendar'; // Default active tab

  // Custom chart data
  dayLabels: string[] = [];
  dayValues: number[] = [];
  maxDayValue: number = 0;
  hourValues: number[] = [];
  maxHourValue: number = 0;
  sessionStats: any[] = [];

  constructor(private trainingSessionService: TrainingSessionService) {}

  ngOnInit(): void {
    this.loadTrainingSessions();
    this.loadStats();
  }

  loadTrainingSessions(): void {
    this.trainingSessionService.getTrainingSessionsByCoach()
      .subscribe({
        next: (data) => {
          this.trainingSessions = data;
          if (this.stats) this.prepareSessionStats();
        },
        error: (error) => console.error('Error loading training sessions:', error)
      });
  }

  deleteSession(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this session?')) {
      this.trainingSessionService.deleteTrainingSession(id)
        .subscribe({
          next: () => {
            this.trainingSessions = this.trainingSessions.filter(session => session.id !== id);
          },
          error: (error) => console.error('Error deleting training session:', error)
        });
    }
  }

  loadStats() {
    this.trainingSessionService.getstats().subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareDayChartData();
        this.prepareHourChartData();
        if (this.trainingSessions.length) this.prepareSessionStats();
        console.log(data);
      },
      error: (error) => console.error('Error loading stats:', error)
    });
  }
  
  prepareDayChartData(): void {
    if (!this.stats?.bookingsByDay) return;
    
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    this.dayLabels = days.map(day => day.charAt(0) + day.slice(1).toLowerCase().slice(0, 2));
    this.dayValues = days.map(day => this.stats.bookingsByDay?.[day] || 0);
    this.maxDayValue = Math.max(...this.dayValues, 1);
  }
  
  prepareHourChartData(): void {
    if (!this.stats?.bookingsByHour) return;
    
    this.hourValues = Array.from({length: 24}, (_, i) => {
      return this.stats.bookingsByHour[i.toString()] || 0;
    });
    this.maxHourValue = Math.max(...this.hourValues, 1);
  }
  
  prepareSessionStats(): void {
    if (!this.stats?.sessionStatistics || !this.trainingSessions) return;
    
    this.sessionStats = Object.keys(this.stats.sessionStatistics).map(id => {
      const session = this.trainingSessions.find(s => s.id.toString() === id);
      const stats = this.stats.sessionStatistics[id];
      return {
        id,
        description: session ? session.description : `Session #${id}`,
        averageRating: stats.averageRating || 0,
        reviewCount: stats.reviewCount || 0
      };
    }).sort((a, b) => b.averageRating - a.averageRating);
  }
  
  // Methods for Y-axis labels
  getDayChartYAxis(): number[] {
    const steps = 5;
    return Array.from({length: steps + 1}, (_, i) => Math.round((this.maxDayValue / steps) * (steps - i)));
  }
  
  getHourChartYAxis(): number[] {
    const steps = 5;
    return Array.from({length: steps + 1}, (_, i) => Math.round((this.maxHourValue / steps) * (steps - i)));
  }
  
  getHourLabels(): string[] {
    return [0, 4, 8, 12, 16, 20, 23].map(h => `${h}:00`);
  }
  
  // Helper methods for visual representations
  getBarHeightPercentage(value: number, max: number): number {
    return (value / max) * 100;
  }
  
  getPointX(index: number): number {
    // Scale to 0-100 range for SVG viewBox
    return (index / 23) * 100;
  }
  
  getPointY(value: number, max: number): number {
    if (max === 0) return 50; // Default position if no data
    // SVG Y coordinate (0 at top, increases downward)
    // Scale to 0-100 range with 10% padding on top and bottom
    return 90 - ((value / max) * 80);
  }
  
  getLineChartPath(): string {
    if (!this.hourValues.length) return '';
    
    return this.hourValues.reduce((path, value, index) => {
      const x = this.getPointX(index);
      const y = this.getPointY(value, this.maxHourValue);
      return path + (index === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  }
  
  getAreaChartPath(): string {
    if (!this.hourValues.length) return '';
    
    const linePath = this.getLineChartPath();
    // Close the path by adding points at the bottom
    return `${linePath} L 100,100 L 0,100 Z`;
  }
  
  getXAxisPosition(hour: string): number {
    const hourValue = parseInt(hour);
    return (hourValue / 23) * 100;
  }
}

import { Component, OnInit } from '@angular/core';
import { StatService } from '../services/stat.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-backnutritionist',
  templateUrl: './backnutritionist.component.html',
  styleUrls: ['./backnutritionist.component.css']
})
export class BacknutritionistComponent implements OnInit {

  totalMeetings = 0;
  confirmedMeetings = 0;
  canceledMeetings = 0;
  totalMedicalFolders = 0;

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Confirmed', 'Canceled'],
    datasets: [
      { data: [0, 0], backgroundColor: ['#4CAF50', '#F44336'] }
    ]
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Meetings', 'Medical Folders'],
    datasets: [
      { data: [0, 0], label: 'Total', backgroundColor: ['#2196F3', '#FF9800'] }
    ]
  };

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.statService.getMeetingStats().subscribe(data => {
      this.totalMeetings = data.totalMeetings;
      this.confirmedMeetings = data.confirmedMeetings;
      this.canceledMeetings = data.canceledMeetings;

      this.pieChartData.datasets[0].data = [this.confirmedMeetings, this.canceledMeetings];
      this.barChartData.datasets[0].data[0] = this.totalMeetings;
    });

    this.statService.getMedicalFolderStats().subscribe(data => {
      this.totalMedicalFolders = data.totalMedicalFolders;
      this.barChartData.datasets[0].data[1] = this.totalMedicalFolders;
    });
  }
}

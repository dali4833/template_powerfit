import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meeting, MeetingService } from 'src/app/front-office/services/meeting.service';


@Component({
  selector: 'app-showmeeting',
  templateUrl: './showmeeting.component.html',
  styleUrls: ['./showmeeting.component.css']
})
export class ShowmeetingComponent implements OnInit {
  meetingId: number = 0;
  meetingData?: Meeting;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.meetingId = Number(idParam);
      this.loadMeeting();
    } else {
      console.error('Missing meeting ID in route!');
    }
  }

  loadMeeting(): void {
    this.meetingService.retrieveMeeting(this.meetingId).subscribe(
      (data: Meeting) => {
        this.meetingData = data;
        console.log('🟢 Meeting loaded:', data);
      },
      (error) => {
        console.error('🔴 Error fetching meeting:', error);
      }
    );
  }
}

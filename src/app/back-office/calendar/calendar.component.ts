import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TrainingSessionService } from '../TrainingSessionMangment/services/TrainingSession.service';

interface TrainingSessionEvent {
  id: number;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  sport: string;
  coach: any;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() numberOfDays: number = 30;
  @Input() events: TrainingSessionEvent[] = [];
  @Input() initialView: string = 'dayGridMonth';
  @Input() headerToolbar: any = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  };
  @Input() timeZone: string = 'local';
  @Input() eventTimeFormat: any = {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false
  };
  @Input() eventDisplay: string = 'block';
  @Input() displayEventEnd: boolean = true;
  @Input() statusColors: { [key: string]: string } = {
    scheduled: '#4CAF50',
    cancelled: '#F44336',
    postponed: '#FFA726',
    default: '#2196F3'
  };

  @Output() eventClicked = new EventEmitter<TrainingSessionEvent>();
  @Output() dateClicked = new EventEmitter<Date>();

  loading = false;
  error: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    datesSet: (dateInfo) => {
      this.fetchEvents(dateInfo.start, dateInfo.end);
    },
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: (info) => {
      this.setEventColor(info);
    }
  };

  @ViewChild('eventDialog') eventDialog!: ElementRef<HTMLDialogElement>;
  selectedEvent: any;

  constructor(private trainingSessionService: TrainingSessionService) {}

  ngOnInit(): void {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + this.numberOfDays);
    this.fetchEvents(today, end);
  }

  private fetchEvents(start: Date, end: Date): void {
    this.loading = true;
    this.error = null;

    this.trainingSessionService.getEventsInRange(start, end).subscribe({
      next: (events) => {
        this.calendarOptions.events = this.formatEvents(events);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  private setEventColor(info: any): void {
    const status = info.event.extendedProps.status?.toLowerCase();
    info.el.style.backgroundColor = this.statusColors[status] || this.statusColors['default'];
  }

  private formatEvents(events: TrainingSessionEvent[]): any[] {
    return events.map(event => ({
      id: event.id.toString(),
      title: `${event.sport} - ${event.description}`,
      start: new Date(`${event.date}T${event.startTime}`),
      end: new Date(`${event.date}T${event.endTime}`),
      extendedProps: {
        idEvent: event.id,
        description: event.description,
        meetLink: event.meetLink,
        sport: event.sport,
      },
      allDay: this.isAllDayEvent(event)
    }));
  }

  private isAllDayEvent(event: TrainingSessionEvent): boolean {
    return event.startTime === '00:00' && event.endTime === '23:59';
  }

  private handleEventClick(clickInfo: EventClickArg): void {
    const eventId = clickInfo.event.extendedProps['idEvent'];
    const originalEvent = this.events.find(e => e.id === eventId);
    if (originalEvent) {
      this.eventClicked.emit(originalEvent);
    }
  }
}

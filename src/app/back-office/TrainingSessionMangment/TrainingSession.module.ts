import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { TrainingSessionRoutingModule } from './TrainingSession-routing.module';
import { EditaddComponent } from './editadd/editadd.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    ListComponent,
    EditaddComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    TrainingSessionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    TrainingSessionRoutingModule
  ]
})
export class TrainingSessionModule { }

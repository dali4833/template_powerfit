import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { BookingRoutingModule } from './booking-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    EditaddComponent,
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    BookingRoutingModule,
  ]
})
export class BookingModule { }
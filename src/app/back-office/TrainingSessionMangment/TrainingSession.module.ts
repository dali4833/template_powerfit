import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { TrainingSessionRoutingModule } from './TrainingSession-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    TrainingSessionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditaddComponent,
    TrainingSessionRoutingModule,
  ]
})
export class TrainingSessionModule { }
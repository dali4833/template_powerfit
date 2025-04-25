import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ClubRoutingModule } from './club-routing.module';
import { EditaddComponent } from './editadd/editadd.component';
import { ClubPerformanceComponent } from './club-performance/club-performance.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    EditaddComponent,
    ClubPerformanceComponent
  ],
  imports: [
    CommonModule,
    ClubRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
    ListComponent,
    EditaddComponent,
    ClubRoutingModule,
    ClubPerformanceComponent

  ]
})
export class ClubModule { }
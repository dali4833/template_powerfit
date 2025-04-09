import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { PacksRoutingModule } from './packs-routing.module';
import { EditaddComponent } from './editadd/editadd.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    EditaddComponent
  ],
  imports: [
    CommonModule,
    PacksRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
    ListComponent,
    EditaddComponent,
    PacksRoutingModule,
  ]
})
export class PacksModule { }
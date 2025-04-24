import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditaddComponent } from './editadd/editadd.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListComponent 
  },
  { 
    path: 'new', 
    component: EditaddComponent 
  },
  { 
    path: ':id/edit',
    component: EditaddComponent 
  },
  { 
    path: ':id', 
    component: DetailsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportsRoutingModule { }
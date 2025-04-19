import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrophiesRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from '../task-board';
import { MainViewComponent } from './index';

export const routes: Routes = [
  {
    path: "", component: MainViewComponent,
    children: [{ path: ":boardId", component: BoardComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

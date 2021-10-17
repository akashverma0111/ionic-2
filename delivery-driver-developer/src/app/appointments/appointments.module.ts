import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentsPage } from './appointments.page';
import { PipesModule } from '../pipes/pipes.module'; ;

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppointmentsPage]
})
export class AppointmentsPageModule {}

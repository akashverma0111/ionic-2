import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BankinginformationPage } from './bankinginformation.page';
import { BrMaskerModule } from 'br-mask';
const routes: Routes = [
  {
    path: '',
    component: BankinginformationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule ,
    BrMaskerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankinginformationPage]
})
export class BankinginformationPageModule {}

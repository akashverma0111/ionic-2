import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeliveryHistory2Page } from './delivery-history2.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryHistory2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeliveryHistory2Page]
})
export class DeliveryHistory2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeliveryHistoryPage } from './delivery-history.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeliveryHistoryPage]
})
export class DeliveryHistoryPageModule {}

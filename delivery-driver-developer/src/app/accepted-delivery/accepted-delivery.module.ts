import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AcceptedDeliveryPage } from './accepted-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptedDeliveryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AcceptedDeliveryPage]
})
export class AcceptedDeliveryPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GalleryCustomModalPage } from './gallery-custom-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GalleryCustomModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GalleryCustomModalPage]
})
export class GalleryCustomModalPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchfilterPage } from './searchfilter.page';

const routes: Routes = [
  {
    path: '',
    component: SearchfilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
     
  ],
  declarations: [SearchfilterPage]
})
export class SearchfilterPageModule {}

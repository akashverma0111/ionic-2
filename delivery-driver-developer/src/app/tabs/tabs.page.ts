import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Events,AlertController, LoadingController, NavController, MenuController } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  user:any=[];
  constructor(public events: Events,public router: Router,public storage: Storage,public menuCtrl: MenuController) {

    this.events.subscribe('userCheck:created', (rs) => {
      this.user=rs;
    });

    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.router.navigate(['/signin']);
    });

  }

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }

}

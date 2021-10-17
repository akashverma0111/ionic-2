import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {  NavController, LoadingController, AlertController, Events,ModalController } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choosetype',
  templateUrl: './choosetype.page.html',
  styleUrls: ['./choosetype.page.scss'],
})
export class ChoosetypePage implements OnInit {
  user:any;
  has_user:boolean=false;
  constructor(public events: Events,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    public modalController: ModalController,
    public serviceForAllService: AllServicesService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      console.log('userData: ', val);
      if (val != null) {
        this.user = val;
        this.has_user=true;
      }
    });
  }

}

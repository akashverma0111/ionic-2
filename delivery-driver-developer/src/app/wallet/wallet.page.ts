import { ViewChild, Component, OnInit } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  res:any;
  ready:boolean=false;
  list:any=[];
  user:any;
  pending_balance:any=0;
  available_balance:any=0;
  available_balance_number:any=0
  listing:any=[];
  constructor(public route: ActivatedRoute,
    public allServicesService: AllServicesService,
    public router: Router,
    public menu: MenuController,
    public events: Events,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
   

  }

  ionViewWillEnter() {
  //  this.menu.enable(false);
    this.storage.get('user').then((val) => {
      console.log('userData: ', val);
      if (val != null) {
        this.user=val;
        this.GetWalletAmount();
        this.WalletWithDrawHistory();
      } else {
        this.router.navigate(['/signin']);
      }
    });

  }


  GetWalletAmount(){
    let data = {
      token:this.user.token
    }
    this.allServicesService.sendData('WalletAmountTotal',data).subscribe(data => {
      this.res = data;
      console.log(this.res);
      if (this.res.status = 'ok') {
        this.ready = true;
        this.pending_balance = this.res.pending_balance;
        this.available_balance=this.res.available_balance;
        this.available_balance_number=this.res.available_balance_number;
      }
    }, (err) => {
      this.ready = true;
      if (err.error.error_code == "user_expire") {
        this.storage.clear();
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }

  WalletWithDrawHistory(){
    let data = {
      token:this.user.token
    }
    this.allServicesService.sendData('WalletWithDrawHistory',data).subscribe(data => {
      this.res = data;
      console.log(this.res);
      if (this.res.status = 'ok') {
        this.ready = true;
        this.listing = this.res.listing;
      }
    }, (err) => {
      this.ready = true;
      if (err.error.error_code == "user_expire") {
        this.storage.clear();
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }


  GetStatus(status){
    if(status==1){
      return "Pending";
    }
    if(status==2){
      return "Approved";
    }

    if(status==3){
      return "Decline";
    }

    if(status==4){
      return "Error";
    }
  }



}



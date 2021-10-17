
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
  selector: 'app-walletrequest',
  templateUrl: './walletrequest.page.html',
  styleUrls: ['./walletrequest.page.scss'],
})
export class WalletrequestPage implements OnInit {
  res:any;
  ready:boolean=false;
  list:any=[];
  user:any;
  total_amount:any=0;
  amount:any=0;
  notes:any;
  constructor(public route: ActivatedRoute,
    public allServicesService: AllServicesService,
    public router: Router,
    public menu: MenuController,
    public events: Events,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public location:Location,
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
        this.total_amount = this.res.total_amount;
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


  WithDrawFunds(){
    let data = {
      token:this.user.token,
      amount:this.amount
    }
    if(this.amount<1){
       this.allServicesService.presentAlert("Please provide a valid amount.")
       return false;
    }

    this.allServicesService.showLoader("generating a request.");
    this.allServicesService.sendData('WalletAmountWithDraw',data).subscribe(data => {
      this.res = data;
      console.log(this.res);
      if (this.res.status = 'ok') {
        this.ready = true;
        this.allServicesService.dismissLoading();
        this.location.back();
      }
    }, (err) => {
      this.ready = true;
      this.allServicesService.dismissLoading();
      if (err.error.error_code == "user_expire") {
        this.storage.clear();
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }

}



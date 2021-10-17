import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {  NavController, LoadingController, AlertController, Events } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BrMaskerModule } from 'br-mask';
import { Stripe } from '@ionic-native/stripe/ngx';

@Component({
  selector: 'app-bankinginformation',
  templateUrl: './bankinginformation.page.html',
  styleUrls: ['./bankinginformation.page.scss'],
})
export class BankinginformationPage implements OnInit {
  bank_form: FormGroup;
  publishable_key:any;
  user:any;
  cardres:any;
  token:any;
  setting:any;
  constructor(public events: Events,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    private stripe: Stripe,
    public serviceForAllService: AllServicesService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) { 

     
      this.bank_form= new FormGroup({
        'account_holder_name': new FormControl('', Validators.compose([Validators.required])),
        'routing_number': new FormControl('',Validators.compose([Validators.required])),
        'account_number': new FormControl('',Validators.compose([Validators.required])),
      });
    }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      console.log('userData: ', val);
      if (val != null) {
        this.user = val;
        
      }
    });

    this.serviceForAllService.getStoreSetting()
    .then(res => {
      this.setting=res;
      this.GetSetting();

    });
  }

  GetSetting(){
    this.serviceForAllService.GetSetting()
    .subscribe(res => {
      this.setting=res;
      this.serviceForAllService.setSetting({
        secret_key:  this.setting.secret_key,
        publishable_key: this.setting.publishable_key,
        about:this.setting.about
      });

    })
  }

  CreatePayment(bank) {
   
    this.stripe.setPublishableKey(this.setting.publishable_key);
    let bank_new = {
      account_holder_name:bank.account_holder_name,
      routing_number: bank.routing_number,
      account_number: bank.account_number,
      account_holder_type: 'individual',
      currency: 'USD',
      country: 'US'
    };

    this.serviceForAllService.showLoader();
    this.stripe.createBankAccountToken(bank_new)
    .then(token => {
      this.token=token;
      console.log(token);
      this.serviceForAllService.addCardtoBank(this.user.token,this.token.id)
      .subscribe(res => {
        this.cardres=res;
        this.serviceForAllService.dismissLoading();
        if (this.cardres.status == "ok") {
           this.bank_form.reset(); 
           this.serviceForAllService.presentAlert(this.cardres.msg);
        }
       
         this.router.navigate(['/managebankcards']);
      },
      (err) => {
        let msg = err.error.errormsg;
          this.serviceForAllService.presentAlert(msg);
          this.serviceForAllService.dismissLoading();
          if (err.error.error_code == "user_not_found") {
             
             this.router.navigate(['/signin']);
          }
     
        })
    })
    .catch(error => {
      console.error(error)
      this.serviceForAllService.presentAlert(error);
      this.serviceForAllService.dismissLoading();
      
    });

    // Get Stripe Toen using cards
   
      
      // this.serviceForAllService.StripeAddBankAccount(this.user.token, bank_new,1)
      // .subscribe(res => {
      //   this.cardres=res;
      //   if (this.cardres.status == "ok") {
      //      this.bank_form.reset(); 
      //      this.serviceForAllService.presentAlert(this.cardres.msg);
      //   }
      //   this.serviceForAllService.dismissLoading();
      // },
      // (err) => {
      //   let msg = err.error.msg;
      //     this.serviceForAllService.presentAlert(msg);
      //     this.serviceForAllService.dismissLoading();
     
      //   })
    

}

}

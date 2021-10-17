import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  user: any;
  cart: any;

  res:any;

  service: any = {};
  price: any = {};
  time: any = {};
  item: any = {};
  selecteddate: any;
  serviceName: any = {};
  is_issue: boolean = true;
  select_day: any;
  select_time: any;
  select_date:any;

  myservices:any=[];

  invtotalItem:any=0
  invtotalamount:any=0

  result:any;
  cards:any=[];
  bank_accounts:any;
  card_accounts:any;
  customer:any;
  error:any;
  ready:boolean=false;
  setting:any;

  Cardready:boolean=true;
  card:any;


  myInput: any;
  type: any;
  amount: any = 0;
  user_id: any;

  username: any;
  cardResult: any;

  hasCards: boolean = false;

  issue_message: any;
  notes: any;
  pay_result: any; 
  
  validateResult: any;
  paynowReady: boolean = true;
  card_issue: boolean = true;
  unique_name: any;
  additional_notes: any;
  userProfile:any;

  message:any;

  

  constructor(public alertCtrl: AlertController,
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public events:Events,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public location: Location,
    public storage: Storage) {
      this.user_id = this.route.snapshot.parent.paramMap.get('user_id');
      events.subscribe('usercardload', (card) => {
        this.storage.get('user').then(userInfo => {
          if (userInfo != null) {
            this.user = userInfo;
            this.GetCards(this.user);
           
          } 
        }, err => {
        });
      });

  }

  ngOnInit() {

    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.GetCards(this.user);
        this.allServicesService.SaveAutoConfiqure(this.user.token);
        this.allServicesService.getSecoondUserInfo(this.user.token, this.user_id).subscribe((result) => {
          this.userProfile = result;
        }, (err) => {
          console.log("error...", err);
          let msg = err.error.errormsg;
        });
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.router.navigate(['/signin']);
    });

    this.storage.get('cart').then(cart => {
      if (cart != null) {
        this.cart = cart;
        console.log(this.cart);
        this.SolveCart(this.cart);
      } else {
        this.location.back();
      }
    }, err => {
      this.location.back();
    });
  }

  SolveCart(card) {

    this.service = card.service;
    this.price = card.price;
    this.item = card.item;
    this.time = card.time;
    this.select_day = card.select_day;
    this.select_time = card.select_time;
    this.selecteddate = card.selecteddate;
    this.serviceName = card.Servicesname;
    this.select_date=card.select_date;

    for (var key in this.service) {
      if (this.service.hasOwnProperty(key)) {
        if (typeof this.service[key] != 'undefined') {
            if (this.service[key] == true) {
                console.log(this.service[key]);
                let serviceOffer = {
                  service_id:key,
                  service_name:this.serviceName[key],
                  price:this.price[key],
                  item:this.item[key]
                }
                this.invtotalItem=parseInt(this.invtotalItem)+parseInt(this.item[key]);
                this.invtotalamount=parseInt(this.invtotalamount)+parseInt(this.price[key]);
                this.myservices.push(serviceOffer)
            }
        
         }
      }
    }

    console.log(this.myservices)

  }

  GetCards(user) {
    //this.is_issue = false;
    this.allServicesService.GetCards(this.user.token)
    .subscribe(res => {

      this.result=res;
      if (this.result.status == "ok") {
        
        this.cards = this.result.cards.data;
        this.customer = this.result.customer;
        this.Cardready=true;
 
      }else{
        this.allServicesService.presentAlert("Something went wrong.");
      }
 
    },(err) => {
      this.error= err.error.errormsg;
      this.Cardready = true;
    });

  } 

  CardradioChecked(card) {
    this.card = card;
    if (this.card != '') {
      this.is_issue = false;
    }
  }

  paynow() {
    if (!this.is_issue) {
      this.paynowReady = false;
      let details = {
        Currency: 'usd',
        Card: this.card,
        Amount: this.invtotalamount * 100,
        notes: this.notes,
        to_user_id: this.user_id,
        myservices:this.myservices,
        invtotalItem:this.invtotalItem,
        invtotalamount:this.invtotalamount,
        select_day:this.select_day,
        select_time:this.select_time,
        select_date:this.select_date
      }
      this.is_issue=true;
      this.allServicesService.GetStripeAuthToken(this.user.token, details)
        .subscribe(res => {
          this.pay_result = res;
          if (this.pay_result.status == "ok") {
          this.storage.remove('cart');
            this.router.navigate(['thankyou'], { queryParams: { msg: this.pay_result.msg, page_title: this.pay_result.page_title } });
          }
          this.paynowReady = true;
          
        },
          err => {
            this.error = err;
            this.allServicesService.presentAlert(this.error.error.msg)
            this.paynowReady = true;
            this.is_issue=false;
          })

    } else {
      this.allServicesService.presentAlert("Something went wrong.")
      this.paynowReady = true;
      this.is_issue=false;
    }
  }


  sendToMessage(userProfile) {
    this.storage.get('user').then((val) => {
      console.log(val);
      if (val != null) {
        this.allServicesService.showLoader();
        this.allServicesService.getCurrentUserInfo(val.token).subscribe((result) => {
          this.res = result;
          console.log(userProfile);
          this.openChatPage(userProfile, this.res.result);
          this.allServicesService.dismissLoading();
        }, (err) => {
          this.allServicesService.dismissLoading();
          console.log("error...", err);
          let msg = err.error.errormsg;
          this.allServicesService.presentAlert(msg);
        });
      }
    });
  }

  openChatPage(userProfile, Currentuser) {
    let userPro = {
      first_name: userProfile.first_name + '' + userProfile.last_name,
      id: parseInt(userProfile.id),
      user_img: userProfile.user_img
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        //  special: JSON.stringify(workout),
        secondUser: JSON.stringify(userPro),
        currentUser: JSON.stringify(Currentuser),
        fromMy: true,
        message:this.message
      }
    };
    console.log(userProfile, 'user', Currentuser);
    this.message='';
    this.navCtrl.navigateForward(['/chat'], navigationExtras);
  }



}

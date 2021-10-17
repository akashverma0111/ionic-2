import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController, AlertController, Events } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
import { Stripe } from '@ionic-native/stripe/ngx';
@Component({
  selector: 'app-billingedit',
  templateUrl: './billingedit.page.html',
  styleUrls: ['./billingedit.page.scss'],
})
export class BillingeditPage implements OnInit {
  card_form: FormGroup;
  publishable_key: any;
  user: any;
  cardres: any;
  card_type: any;
  setting:any;
  action:any;

  card_id:any;
  card_name:any;
  card_last4:any;
  card_brand:any;
  card_exp_month:any;
  card_exp_year:any;
  default:any;
  
  constructor( 
    public events: Events,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    private stripe: Stripe,
    public serviceForAllService: AllServicesService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) { 

    this.card_type = this.route.snapshot.parent.paramMap.get('type');
    this.card_id = this.route.snapshot.parent.paramMap.get('card_id');
    this.card_last4 = this.route.snapshot.parent.paramMap.get('card_last4');
    this.card_brand = this.route.snapshot.parent.paramMap.get('card_brand');
    this.card_exp_month = this.route.snapshot.parent.paramMap.get('card_exp_month');
    this.card_exp_year = this.route.snapshot.parent.paramMap.get('card_exp_year');
    this.card_name=this.route.snapshot.parent.paramMap.get('card_name');
    this.default=this.route.snapshot.parent.paramMap.get('default');
    console.log(this.card_type);
    if(this.card_exp_month.length==1){
      this.card_exp_month="0"+this.card_exp_month;
    }
  

    // this.serviceForAllService.getStoreSetting()
    // .then(res => {
    //   this.setting=res;
    //   this.GetSetting();

    // });

  

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

  ngOnInit() {

    this.card_form = new FormGroup({
      'name': new FormControl(this.card_name, Validators.compose([Validators.required])),
      'expire_date': new FormControl(this.card_exp_month+"/"+this.card_exp_year, Validators.compose([Validators.required])),
    });

    this.storage.get('user').then((val) => {
      console.log('userData: ', val);
      if (val != null) {
        this.user = val;

      }
    }); 
  }

  CreatePayment(card) {

      let card_details = card.expire_date.split('/');
      let card_new = {
        name: card.name,
        expMonth: card_details[0],
        expYear: card_details[1]
      };
      this.serviceForAllService.showLoader();
      this.serviceForAllService.updateCard(this.user.token,this.card_id,card_new,this.card_type)
        .subscribe(res => {
          this.cardres = res;
          this.serviceForAllService.dismissLoading();
          if (this.cardres.status == "ok") {
            this.card_form.reset();
            this.serviceForAllService.presentAlert(this.cardres.msg);
            this.router.navigate(['/managebankcards']);
          }
        },
          (err) => {
            let msg = err.error.errormsg;
            if(msg==''){
              this.serviceForAllService.presentAlert("Something went wrong, please try again later.");
            }else{
              this.serviceForAllService.presentAlert(msg);
            }
            this.serviceForAllService.dismissLoading();

          })

  }








}


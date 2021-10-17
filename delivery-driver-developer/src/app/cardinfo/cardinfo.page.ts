import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, MenuController, NavController, LoadingController, AlertController, Events } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cardinfo',
  templateUrl: './cardinfo.page.html',
  styleUrls: ['./cardinfo.page.scss'],
})
export class CardinfoPage implements OnInit {
  user: any;
  ready: boolean = false;
  card_id:any;
  card_name:any;
  card_last4:any;
  card_brand:any;
  card_exp_month:any;
  card_exp_year:any;
  type:any;
  default_for_currency:boolean=false;

  cardres:any;


  constructor(
    private route: ActivatedRoute,
    public events: Events,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    public serviceForAllService: AllServicesService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
        this.card_id = params.card_id;
        this.card_name=params.card_name;
        this.card_last4=params.card_last4;
        this.card_brand=params.card_brand;
        this.card_exp_month=params.card_exp_month;
        this.card_exp_year=params.card_exp_year;
        this.type=params.type;
        this.default_for_currency=params.default_for_currency;

        if(this.card_exp_month.length==1){
          this.card_exp_month="0"+this.card_exp_month;
        }
      }
    });
  }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      console.log('userData: ', val);
      if (val != null) {
        this.user = val;
        //this.getUserProfile(val.token);
      }else{
        this.router.navigate(['/signin']);
      }
    },err=>{
      this.router.navigate(['/signin']);
    });
  }

  edit(){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          card_id: this.card_id,
          card_name: this.card_name,
          card_last4: this.card_last4,
          card_brand: this.card_brand,
          card_exp_month: this.card_exp_month,
          card_exp_year: this.card_exp_year,
          type:this.type,
          view:'edit'
        }
      };
      if(this.type=='bank_account'){
        this.router.navigate(['bankinginformation'], navigationExtras);
      }else{
        this.router.navigate(['billingedit'], navigationExtras);
      }
     
  }
 
  remove(type){

      this.serviceForAllService.showLoader();
      this.serviceForAllService.removeCard(this.user.token,this.card_id,type)
        .subscribe(res => {
          this.cardres = res;
          this.serviceForAllService.dismissLoading();
          if (this.cardres.status == "ok") {
            //this.serviceForAllService.presentAlert(this.cardres.msg);
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


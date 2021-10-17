import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController, AlertController, Events, Platform } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
import { Stripe } from '@ionic-native/stripe/ngx';
import { Location } from '@angular/common';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.page.html',
    styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {

    card_form: FormGroup;
    publishable_key: any;
    user: any;
    cardres: any;
    card_type: any;
    setting: any;
    action: any;
    page: any;

    constructor(
        public events: Events,
        public route: ActivatedRoute,
        public event: Events,
        public navCtrl: NavController,
        public storage: Storage,
        public router: Router,
        public plt: Platform,
        private stripe: Stripe,
        private location: Location,
        public serviceForAllService: AllServicesService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
    ) {
        this.route.params.subscribe((params) => {
            this.card_type = params.type;
            this.action = params.view;
            this.page = params.page;

            console.log(this.card_type, 'params');
        });

        this.card_form = new FormGroup({
            'name': new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
            'number': new FormControl(''),
            'expire_date': new FormControl(''),
            'cvc': new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
        });
    }

    GetSetting() {
        this.serviceForAllService.GetSetting()
            .subscribe(res => {
                this.setting = res;
                this.serviceForAllService.setSetting({
                    secret_key: this.setting.secret_key,
                    publishable_key: this.setting.publishable_key,
                    about: this.setting.about
                });

            })
    }

    ionViewWillEnter() {
        this.GetSetting();
        // this.serviceForAllService.getStoreSetting()
        // .then(res => {
        //   this.setting = res;
        //   this.GetSetting();

        // });
        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                this.user = val;
                // this.serviceForAllService.getStoreSetting()
                //     .then(res => {
                //         this.setting = res;
                //         this.GetSetting();
                //     });
            } else {
                this.storage.clear();
                this.router.navigate(['/signin']);

            }
        }, err => {
            this.storage.clear();
            this.router.navigate(['/signin']);
        });
    }

    ngOnInit() {

        // this.storage.get('user').then((val) => {
        //     console.log('userData: ', val);
        //     if (val != null) {
        //         this.user = val;
        //         this.serviceForAllService.getStoreSetting()
        //             .then(res => {
        //                 this.setting = res;
        //                 this.GetSetting();

        //             });

        //     } else {
        //         this.storage.clear();
        //         this.router.navigate(['/signin']);

        //     }
        // }, err => {
        //     this.storage.clear();
        //     this.router.navigate(['/signin']);
        // });
    }

    CreatePayment(card) {

        let card_details = card.expire_date.split('/');
        this.stripe.setPublishableKey(this.setting.publishable_key);
        let card_new = {
            name: card.name,
            number: card.number,
            expMonth: card_details[0],
            expYear: card_details[1],
            cvc: card.cvc,
            currency: 'USD'
        };
        // Get Stripe Toen using cards
        this.serviceForAllService.showLoader();
        this.stripe.createCardToken(card_new).then(token => {
            console.log(token);

            this.serviceForAllService.CreateStripeUser(this.user.token, token.id, 1)
                .subscribe(res => {
                    this.cardres = res;
                    this.serviceForAllService.dismissLoading();
                    if (this.cardres.status == "ok") {
                        this.card_form.reset();
                        this.serviceForAllService.presentAlert(this.cardres.msg);
                        if (this.page == "invoice") {
                            this.events.publish('usercardload', this.page);
                            this.location.back();
                        } else {
                            this.router.navigate(['/managebankcards']);
                        }
                    }
                },
                    (err) => {
                        this.serviceForAllService.dismissLoading();
                        console.log(err.error.msg + ' err in forpayment: ', err);

                        let msg = "Something went wrong, please try again later.";

                        if (err.error.error_code == 'stripe_error' || err.error.error_code == 'user_expire') {
                            msg = err.error.msg;
                            console.log("aaaa: ", msg);
                        } else {
                            msg = err.error.errormsg;
                            console.log("bbbb: ", msg);
                        }

                        this.serviceForAllService.presentAlert(msg);

                    });

            /*
            if (this.card_type == "forpayment") {
    
              this.serviceForAllService.CreateStripeUser(this.user.token, token.id, 1)
                .subscribe(res => {
                  this.cardres = res;
                  this.serviceForAllService.dismissLoading();
                  if (this.cardres.status == "ok") {
                    this.card_form.reset();
                    this.serviceForAllService.presentAlert(this.cardres.msg);
                    if (this.page == "invoice") {
                      this.events.publish('usercardload', this.page);
                      this.location.back();
                    } else {
                      this.router.navigate(['/managebankcards']);
                    }
    
                  }
    
    
                },
                  (err) => {
                    let msg = err.error.errormsg;
                    if (msg == '') {
                      this.serviceForAllService.presentAlert("Something went wrong, please try again later.");
                    } else {
                      this.serviceForAllService.presentAlert(msg);
                    }
                    this.serviceForAllService.dismissLoading();
    
                  })
            }
    
    
            if (this.card_type == "forinstant") {
    
              this.serviceForAllService.addCardtoBank(this.user.token, token.id)
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
                    let msg = err.error.msg;
                    if (msg == '') {
                      this.serviceForAllService.presentAlert("Something went wrong, please try again later.");
                    } else {
                      this.serviceForAllService.presentAlert(msg);
                    }
    
                    this.serviceForAllService.dismissLoading();
                    if (err.error.error_code == "user_not_found") {
    
                      this.router.navigate(['/signin']);
                    }
    
                  })
            }
            */

        })
            .catch(error => {
                console.error(error)
                this.serviceForAllService.presentAlert(error);
                this.serviceForAllService.dismissLoading();

            });
    }
}

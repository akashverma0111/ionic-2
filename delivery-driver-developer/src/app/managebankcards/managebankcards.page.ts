import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController, AlertController, Events, ModalController } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ChoosetypePage } from '../choosetype/choosetype.page';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-managebankcards',
    templateUrl: './managebankcards.page.html',
    styleUrls: ['./managebankcards.page.scss'],
})
export class ManagebankcardsPage implements OnInit {
    user: any;
    result: any;
    cards: any;
    bank_accounts: any;
    card_accounts: any;
    customer: any;
    error: any;
    ready: boolean = false;
    setting: any;
    can_add_card: boolean = false;
    verification_need: boolean = false;
    update_url: any = '';
    res: any;
    checkOutPageText = "Place Your Order";
    public device = '';
    public attributes = [];
    public headerHexColor = "#51688F";

    stripe_account_id: any = '';

    constructor(
        public events: Events,
        public navCtrl: NavController,
        public storage: Storage,
        public route: ActivatedRoute,
        public router: Router,
        public modalController: ModalController,
        public serviceForAllService: AllServicesService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public inAppBrowser: InAppBrowser
    ) {
        this.route.params.subscribe((params) => {
            if (params.stripe_account_id != '' && params.stripe_account_id != undefined) {
                this.stripe_account_id = params.stripe_account_id;
                this.save_stripe_account_id(this.stripe_account_id);
            }
            console.log("stripe_account_id", this.stripe_account_id);
        });
        this.GetSetting();
    }

    ngOnInit() {
        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                this.user = val;
                this.serviceForAllService.SaveAutoConfiqure(this.user.token);
                this.GetCards(this.user);
                this.get_stripe_account_id(this.user.token);

            }
        });
    }

    ionViewWillEnter() {
        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                this.user = val;
                this.serviceForAllService.SaveAutoConfiqure(this.user.token);
                this.GetCards(this.user);
            }
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

    async openChooseModal() {
        const modal = await this.modalController.create({
            component: ChoosetypePage,
            componentProps: {
            }
        });
        return await modal.present();
    }

    GetCards(user) {
        this.ready = false;
        this.serviceForAllService.GetCards(this.user.token)
            .subscribe(res => {
                this.result = res;
                if (this.result.status == "ok") {
                    this.cards = this.result.cards.data;
                    this.bank_accounts = this.result.bank_accounts.data;
                    this.card_accounts = this.result.card_accounts.data;
                    this.customer = this.result.customer;
                    this.can_add_card = this.result.can_add_card;
                    this.verification_need = this.result.verification_need;
                    this.update_url = this.result.update_url;
                    this.error = '';
                    this.ready = true;

                } else {
                    this.serviceForAllService.presentAlert("Something went wrong.");
                }

            }, (err) => {
                this.error = err.error.errormsg;
                this.can_add_card = err.error.can_add_card;
                if (this.error == "Not any resources found.") {
                    // this.can_add_card=true;
                }
                this.ready = true;
            });

    }
    GotoProfile() {
        this.router.navigate(['/barbercontactinfo']);
    }


    GotoCardInfo(v, type) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                card_id: v.id,
                card_name: v.name,
                card_last4: v.last4,
                card_brand: v.brand,
                card_exp_month: v.exp_month,
                card_exp_year: v.exp_year,
                default_for_currency: false,
                type: type
            }
        };
        this.router.navigate(['/cardinfo'], navigationExtras);
    }

    GotoBankAccountInfo(v, type) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                card_id: v.id,
                card_name: v.account_holder_name,
                card_last4: v.last4,
                card_brand: v.bank_name,
                card_exp_month: v.routing_number,
                card_exp_year: v.account_holder_type,
                default_for_currency: v.default_for_currency,
                type: type
            }
        };
        this.router.navigate(['/cardinfo'], navigationExtras);
    }

    getParams = function (url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };

    /*
    activeAccount() {
        let options: InAppBrowserOptions = {
            statusbar: {
                color: this.headerHexColor
            },
            title: {
                color: '#ffffff',
                staticText: this.checkOutPageText,
                showPageTitle: false
            },
            closeButton: {
                wwwImage: 'assets/close.png',
                align: 'right',
                event: 'closePressed'
            },
            backButton: {
                wwwImage: 'assets/back.png',
                align: 'left'
                //event: 'closePressed'
            },
            backButtonCanClose: true,
            location: "no",
            footercolor: "#c7fedc",
            hidenavigationbuttons: "yes",
            hideurlbar: "yes",
            toolbarcolor: "#c7fedc",
            //hidden: 'yes',
            // clearcache: "yes",
            // clearsessioncache:'yes'
        };


        const b: InAppBrowserObject = this.inAppBrowser.create(this.update_url, "_blank", options);
        let orderPlaced = false;
        b.on('loadstart').subscribe(res => {
            console.log(res);
            if (res.url.indexOf('stripe_accept') != -1) {
                console.log(res);
                let p = this.getParams(res.url);
                console.log(p)
                this.GetCards(this.user);
                b.close();
            } else if (res.url.indexOf('error_twitter') != -1) {
                b.close();
                this.GetCards(this.user);
            }

        });

        b.on('loadstop').subscribe(res => {
            console.log('loadstop');
        });

        b.on('exit').subscribe(res => {
            this.GetCards(this.user);
        });

    }
    */

    save_stripe_account_id(stripe_account_id) {
        this.storage.get('user').then((val) => {
            console.log('userData save_stripe_account_id: ', val);
            if (val != null && stripe_account_id != null) {
                this.serviceForAllService.save_stripe_account_id(val.token, stripe_account_id).subscribe((res) => {
                    let rs: any = [];
                    console.log("save_stripe_account_id: ", res);
                    this.stripe_account_id = rs.stripe_account_id;
                });
            }
        });
    }

    get_stripe_account_id(token) {
        this.serviceForAllService.get_stripe_account_id(token).subscribe((res) => {
            let rs: any = [];
            rs = res;
            console.log(rs.stripe_account_id);
            this.stripe_account_id = rs.stripe_account_id;
        });
    }

    setupStripe() {
        this.error = '';
        let options: any = {
            location: 'no',
            closebuttoncaption: 'Close',
        };

        const url: string = "https://deliverydriver.betaplanets.com/stripe_connect/connect.php";
        const b: InAppBrowserObject = this.inAppBrowser.create(url, "_blank", options);
        b.on('loadstart').subscribe(res => {
            console.log("stripe response=", res);

            if (res.url.indexOf('stripe_account_id') != -1) {
                const stripe_url = res.url;
                if (stripe_url != '' && stripe_url != undefined) {
                    const params = new URL(stripe_url).searchParams;
                    this.stripe_account_id = params.get('stripe_account_id'); // "1"
                    this.save_stripe_account_id(this.stripe_account_id);
                    console.log("stripe_account_id=", this.stripe_account_id);

                }
                // let p = this.getParams(res.url);
                // console.log(p)
                // this.GetCards(this.user);
                b.close();
            }
            //  else if (res.url.indexOf('error_twitter') != -1) {
            //   b.close();
            //   this.GetCards(this.user);
            // }

        });

        b.on('loadstop').subscribe(res => {
            console.log('loadstop');
        });

        b.on('exit').subscribe(res => {
            // this.get_stripe_account_id(this.user.token);
            this.GetUserProfile();
            this.GetCards(this.user);

        });
    }

    GetUserProfile() {
        this.serviceForAllService.getData('getProfile/?token=' + this.user.token).subscribe(data => {
            this.res = data;
            if (this.res.status = 'ok') {
                this.ready = true;
                this.user = this.res;
                console.log(this.res);
                //this.RenderProfileData();
            }
        }, (err) => {
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.serviceForAllService.presentAlert(err.error.errormsg);
                this.router.navigate(['/signin']);
            }
            this.serviceForAllService.presentAlert(err.error.errormsg);
        })
    }

}

import { Component, OnInit } from '@angular/core';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController, Events, ModalController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.page.html',
    styleUrls: ['./make-payment.page.scss'],
})
export class MakePaymentPage implements OnInit {

    user: any = [];
    result: any = [];
    cards: any = [];
    bank_accounts: any;
    card_accounts: any;
    customer: any;
    error: any;
    ready: boolean = false;
    setting: any;
    can_add_card: boolean = false;
    user_role: any;
    stripe_account_id: any = null;
    totalPrice: any = 0;
    delivery_fees: any = 0;
    order_amount: any = 0;
    loading: any;
    booking_id: any;
    barber_id: any;
    
    constructor(
        public serviceForAllService: AllServicesService,
        public storage: Storage,
        public route: ActivatedRoute,
        public router: Router,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastController: ToastController
    ) {

        this.route.params.subscribe((params) => {
            if (params) {
                let queryParams: any=[];
                queryParams = params;
                console.log("queryParams:  "+JSON.stringify(queryParams));

                this.booking_id = params.booking_id;
                this.delivery_fees = params.delivery_fees;
                this.order_amount = params.order_amount;
                this.totalPrice = params.total;
                this.barber_id = params.barber_id;
                console.log("Params : ", this.booking_id);
            }
        });

    }

    ngOnInit() {
        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                this.user = val;
                this.user_role = val.role;
                // this.serviceForAllService.SaveAutoConfiqure(this.user.token);
                this.GetCards(this.user);
            }
        });
    }

    GetCards(user) {
        this.serviceForAllService.GetCards(this.user.token)
            .subscribe(res => {
                this.result = res;
                if (this.result.status == "ok") {
                    console.log(this.result);
                    this.error = "";
                    this.cards = this.result.cards.data;
                    this.card_accounts = this.result.card_accounts.data;
                    this.customer = this.result.customer;
                    this.can_add_card = this.result.can_add_card;
                    this.ready = true;

                } else {
                    this.serviceForAllService.presentAlert("Something went wrong.");
                }

            }, (err) => {
                this.error = err.error.errormsg;
                if (this.error == "No cards added yet.") {
                    this.can_add_card = true;
                    this.cards = [];
                }
                if (err.error.error_code == 'invalid_token') {
                    this.serviceForAllService.presentAlert(this.error);
                    this.storage.clear();
                    this.router.navigate(['/signin']);
                }

                this.ready = true;
            });

    }

    async make_payment(card) {

        let alert = await this.alertCtrl.create({
            header: 'Confirm!',
            message: "Are you sure ?",
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {

                        console.log("Card data : ", card);
                       
                        let card_id, customer;
                        card_id = card.id
                        customer = card.customer;

                        this.showLoader();
                        this.storage.get('user').then((val) => {
                            console.log(val);
                            if (val != null) {
                                this.serviceForAllService.make_payment(this.barber_id, val.token, this.booking_id, this.delivery_fees, this.order_amount, this.totalPrice, card_id, customer, true, 'delivery').subscribe((result) => {

                                    if (result['status'] == "ok") {
                                        console.log("Api response : ", result);
                                        let msg = result;
                                        this.dismissLoading();
                                        this.presentToast(msg['message']);
                                        this.router.navigate(['/booking2/' + this.booking_id]);
                                    } else {
                                        let msg = result;
                                        this.dismissLoading();
                                        this.presentToast(msg['message']);
                                    }

                                }, (err) => {
                                    this.dismissLoading();
                                    console.log("error...", err);
                                    let msg = err.error.message;
                                    if(msg !='' && msg != null){
                                        this.serviceForAllService.presentAlert(msg);
                                    }
                                });
                            }
                        });

                    }
                },
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ],
            cssClass: 'comment-alert'
        });

        await alert.present();




    }

    addCard() {
        console.log("add card click");
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    async dismissLoading() {
        if (this.loading) {
            console.log(this.loading);
            await this.loading.dismiss();
        }
    }

    async showLoader() {
        this.loading = await this.loadingCtrl.create({ message: 'Please wait...' });
        this.loading.present();
    }

}

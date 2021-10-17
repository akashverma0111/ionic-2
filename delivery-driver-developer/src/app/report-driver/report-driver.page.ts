import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController, Events, ModalController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-report-driver',
    templateUrl: './report-driver.page.html',
    styleUrls: ['./report-driver.page.scss'],
})
export class ReportDriverPage implements OnInit {

    user: any = [];
    loading: any;
    booking_id: any;
    driver_id: any;
    complainForm: FormGroup;
    res: any = [];

    validation_messages = {
        phone: [{ type: "required", message: "Phone is required." }],
        email: [
            { type: "required", message: "Email is required." },
            { type: "pattern", message: "Enter a valid email." }
        ],
        description: [{ type: "required", message: "Description is required." }]
    };

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
                let queryParams: any = [];
                queryParams = params;
                console.log("queryParams:  " + JSON.stringify(queryParams));

                this.booking_id = params.booking_id;
                this.driver_id = params.driver_id;
                console.log("booking_id : ", this.booking_id);
            }
        });

        this.storage.get('user').then((val) => {
            console.log('userData: ', val);
            if (val != null) {
                this.user = val;
            }
        });

    }

    ngOnInit() {
        this.complainForm = new FormGroup({
            'phone': new FormControl('', Validators.compose([
                Validators.required
            ])),
            'email': new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            'description': new FormControl('', Validators.compose([
                Validators.required
            ]))
        });
    }

    ionViewWillEnter() {

    }

    driver_complain() {
        this.complainForm.value.token = this.user.token;
        this.complainForm.value.booking_id = this.booking_id;
        this.complainForm.value.driver_id = this.driver_id;

        this.showLoader();

        this.serviceForAllService.driver_complain(this.complainForm.value).subscribe((data) => {
            this.dismissLoading();
            console.log(data);
            this.res = data;
            if(this.res.status == 'ok'){
                this.complainForm.reset();
                this.router.navigate(["booking2/"+this.booking_id]);
            }
            this.serviceForAllService.presentToast(this.res.msg);
        }, (err) => {
            this.dismissLoading();
            console.log("error...", err);
            let msg = err.error.errormsg;
            this.serviceForAllService.presentToast(msg);
        });
    }

    async showLoader() {
        this.loading = await this.loadingCtrl.create({ message: 'Please wait...' });
        this.loading.present();
    }

    async dismissLoading() {
        if (this.loading) {
            console.log(this.loading);
            await this.loading.dismiss();
        }
    }

}

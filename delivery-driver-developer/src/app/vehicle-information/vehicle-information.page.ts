import { Component, OnInit } from '@angular/core';
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'app-vehicle-information',
    templateUrl: './vehicle-information.page.html',
    styleUrls: ['./vehicle-information.page.scss'],
})
export class VehicleInformationPage implements OnInit {

    user: any = [];
    vehicle_info: any = [];
    ready: boolean;

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        private route: ActivatedRoute,
        public router: Router,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public toastController: ToastController,
        public storage: Storage,
        public events: Events
    ) {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                // this.get_vehicle_information();
            }
        }, err => {

        });
    }
    slideOpts = {
        initialSlide: 6,
        speed: 400,
        slidesPerView: 3.8
    };
    ngOnInit() {
    }

    ionViewWillEnter() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.get_vehicle_information();
            }
        });
    }

    get_vehicle_information() {
        this.ready = false;
        this.allServicesService.getData('get_vehicle_information/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.vehicle_info = res.vehicle_info;
            console.log('this.vehicle_info: ', this.vehicle_info);
        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    goto_update_vehicle_info() {
        let queryData: any = [];
        queryData['action'] = 'update';
        let navigationExtras: NavigationExtras = {
            queryParams: queryData
        };
        this.router.navigate(['car-info'], navigationExtras);
    }

}

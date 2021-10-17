import { Component, OnInit } from '@angular/core';
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'app-document-information',
    templateUrl: './document-information.page.html',
    styleUrls: ['./document-information.page.scss'],
})
export class DocumentInformationPage implements OnInit {

    user: any = [];
    document_info: any = [];
    ready: boolean;
    driver_license_url: any = 'assets/imgs/document-info.png';
    insurance_url: any = 'assets/imgs/document-info.png';
    registration_url: any = 'assets/imgs/document-info.png';

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
                // this.get_document_information();
            }
        }, err => {

        });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.get_document_information();
            }
        });
    }

    get_document_information() {
        this.ready = false;
        this.allServicesService.getData('get_document_information/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.document_info = res.document_info;
            console.log('this.document_info: ', this.document_info);
            this.driver_license_url = this.document_info.driver_license_url;
            this.insurance_url = this.document_info.insurance_url;
            this.registration_url = this.document_info.registration_url;
        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    goto_update_document_info() {
        let queryData: any = [];
        queryData['action'] = 'update';
        let navigationExtras: NavigationExtras = {
            queryParams: queryData
        };
        this.router.navigate(['document-info'], navigationExtras);
    }

}

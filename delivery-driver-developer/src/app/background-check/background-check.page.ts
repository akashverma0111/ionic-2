import { Component, OnInit } from '@angular/core';
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from "@ionic/storage";

@Component({
    selector: 'app-background-check',
    templateUrl: './background-check.page.html',
    styleUrls: ['./background-check.page.scss'],
})
export class BackgroundCheckPage implements OnInit {

    user: any = [];
    background_check_info: any = [];
    ready: boolean;
    ischecked_personal_information_encryption: boolean = false;
    ischecked_doesnt_affect_your_credit: boolean = false;

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
                this.get_background_check();
            }
        });
    }

    get_background_check() {
        this.ready = false;
        this.allServicesService.getData('get_background_check/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.background_check_info = res.background_check_info;
            console.log('this.background_check_info: ', this.background_check_info);

            if(this.background_check_info.personal_information_encryption == true || this.background_check_info.personal_information_encryption == 1){
                this.ischecked_personal_information_encryption = true;
            }else{
                this.ischecked_personal_information_encryption = false;
            }
            if(this.background_check_info.doesnt_affect_your_credit == true || this.background_check_info.doesnt_affect_your_credit == 1){
                this.ischecked_doesnt_affect_your_credit = true;
            }else{
                this.ischecked_doesnt_affect_your_credit = false;
            }

        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    goto_background_check_edit() {
        let queryData: any = [];
        queryData['action'] = 'update';
        let navigationExtras: NavigationExtras = {
            queryParams: queryData
        };
        this.router.navigate(['background-check-edit'], navigationExtras);
    }

}

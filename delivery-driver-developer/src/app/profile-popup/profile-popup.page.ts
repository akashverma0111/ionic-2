import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, } from "@ionic/angular";
import { Router } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'app-profile-popup',
    templateUrl: './profile-popup.page.html',
    styleUrls: ['./profile-popup.page.scss'],
})
export class ProfilePopupPage implements OnInit {

    user: any = [];

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public actionSheetController: ActionSheetController,
        public toastController: ToastController,
        public storage: Storage,
        public events: Events
    ) { 
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.allServicesService.SaveAutoConfiqure(this.user.token);
            }
        }, err => {

        });
    }

    ngOnInit() {
    }

    complete_profile() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                let formValue = {
                    token: this.user.token
                }
                this.allServicesService.showLoader('Please wait...');
                this.allServicesService.sendData('complete_profile', formValue).subscribe(
                    result => {
                        let rs: any = [];
                        rs = result;
                        console.log("result here", result);
                        if (rs.status == "ok") {
                            // this.oneSignal.getIds().then((data) => {
                            // 	console.log(data);
                            // 	this.deviceToken = data.userId;
                            // });
                            this.allServicesService.dismissLoading();
                            if (rs.msg != '') {
                                this.allServicesService.presentToast(rs.msg);
                            }
                            /*
                            this.events.publish('user:complete_profile', this.user);

                            this.user.completed_step = 'complete_profile';

                            this.storage.set('user_profile', this.user);
                            this.storage.set('user', this.user);

                            
                            //   this.navController.setDirection('root');
                            this.router.navigate(['/tabs/home-user']);
                            */
                           
                           this.storage.clear();
                           this.events.publish('userCheck:created', 'userNotLogin');
                           this.router.navigate(['/signin']);

                        }
                    },
                    err => {
                        console.log("Error  == ", err);
                        this.allServicesService.dismissLoading();
                        this.allServicesService.presentAlert(err.error.errormsg);
                    }
                );
            } else {
                this.allServicesService.presentAlert('User token expired, please login again.');
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });

    }

}

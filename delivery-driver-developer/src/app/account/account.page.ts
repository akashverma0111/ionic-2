import { Component, OnInit } from '@angular/core';
import { Events, MenuController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AllServicesService } from '../all-services.service';
@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

    user: any = [];
    res: any = [];
    ready: boolean = false;
    user_info: any = [];
    user_avatar: any = 'http://1.gravatar.com/avatar/1aedb8d9dc4751e229a335e371db8058?s=96&d=mm&r=g';

    constructor(
        public menuCtrl: MenuController,
        public alertController: AlertController,
        private router: Router,
        public allServicesService: AllServicesService,
        public events: Events,
        public storage: Storage
    ) { }

    ngOnInit() {

        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.GetUserProfile();
            } else {
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });

    }

    ionViewWillEnter() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.GetUserProfile();
            } else {
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });
    }

    GetUserProfile() {
        this.allServicesService.getData('getProfile/?token=' + this.user.token).subscribe(data => {
            this.res = data;
            if (this.res.status = 'ok') {
                this.ready = true;
                this.user_info = this.res;
                this.user = this.user_info;

                this.user_avatar = this.user_info.userImage;
                console.log(this.res);
                //this.RenderProfileData();
            }
        }, (err) => {
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.allServicesService.presentAlert(err.error.errormsg);
                this.router.navigate(['/signin']);
            }
            this.allServicesService.presentAlert(err.error.errormsg);
        })
    }


    async DoLogout() {
        const alert = await this.alertController.create({
            header: 'Logout',
            message: 'Are you sure ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Logout',
                    handler: () => {
                        this.storage.clear();
                        this.events.publish('userCheck:created', 'userNotLogin');
                        this.router.navigate(['/signin']);
                    }
                }
            ]
        });
        await alert.present();

    }

    goto_background_check_ques() {
        let queryData: any = [];
        queryData['action'] = 'update';
        let navigationExtras: NavigationExtras = {
            queryParams: queryData
        };
        this.router.navigate(['background-check-ques'], navigationExtras);
    }


}


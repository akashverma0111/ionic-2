import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController, Platform, MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    user: any;
    res: any;
    ready: boolean = false;
    notifications: any = [];
    loading: any;

    constructor(
        public menuCtrl: MenuController,
        public alertCtrl: AlertController,
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public toastController: ToastController,
        public router: Router,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        public location: Location,
        public storage: Storage
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.GetNotification();
                this.allServicesService.SaveAutoConfiqure(this.user.token);
            } else {
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });
    }

    GetNotification() {
        this.allServicesService.getData('GetMyNotifications/?type=user&token=' + this.user.token).subscribe(data => {
            this.res = data;
            console.log(this.res);
            if (this.res.status = 'ok') {
                this.ready = true;
                this.notifications = this.res.notifications;
            }
        }, (err) => {
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.router.navigate(['/signin']);
            }
            this.allServicesService.presentAlert(err.error.errormsg);
        })
    }

    NavigatePage(notification) {
        if (notification.type == "msg_push") {
            this.router.navigate(['/tabs/messages']);
        } else {
            this.router.navigate(['/booking2/' + notification.post_id]);
        }

    }

    async delete_notification_confirm(notification_id) {
        // console.log("notification_id : ",notification_id);
    
        const alert = await this.alertCtrl.create({
          header: 'Delete Notification',
          message: 'Are you sure ?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Yes',
              handler: () => {
                console.log('Confirm Okay');
                this.allServicesService.deleteNoti(this.user.token, notification_id).subscribe((result) => {
                  console.log("Result === ", result);
                  let rs: any = [];
                  rs = result;
                  let msg = rs.msg;
                  this.presentToast(msg);
    
                  this.GetNotification();
                }, err => {
                  console.log("ERROR data === ", JSON.stringify(err));
                  this.loading.dismiss();
                  let msg = err.error.errormsg;
                  this.presentToast(msg);
                })
              }
            }
          ]
        });
    
        await alert.present();
    
      }
    
      async clear_all_notifications() {
        const alert = await this.alertCtrl.create({
          header: 'Delete all notifications',
          message: 'Are you sure ?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Yes',
              handler: () => {
                console.log('Confirm Okay');
                this.allServicesService.clear_all_notifications(this.user.token).subscribe((result) => {
                  console.log("Result === ", result);
                  let rs: any = [];
                  rs = result;
                  let msg = rs.msg;
                  this.presentToast(msg);
    
                  this.GetNotification();
                }, err => {
                  console.log("ERROR data === ", JSON.stringify(err));
                  this.loading.dismiss();
                  let msg = err.error.errormsg;
                  this.presentToast(msg);
                })
              }
            }
          ]
        });
    
        await alert.present();
      }

      async showLoader() {
        this.loading = await this.loadingCtrl.create({ message: 'Please wait...', cssClass: 'custom-load' });
        this.loading.present();
      }
    
      async presentToast(msg) {
        const toast = await this.toastController.create({
          message: msg,
          duration: 2000
        });
        toast.present();
      }
    
      async dismiss() {
        return await this.loadingCtrl
          .dismiss()
          .then(() => console.log("dismissed"));
      }

} 

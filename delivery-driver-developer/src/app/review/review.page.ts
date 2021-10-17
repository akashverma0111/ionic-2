import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Events, Platform, ToastController, ModalController, NavController, NavParams, MenuController, LoadingController, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-review',
    templateUrl: './review.page.html',
    styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

    user:any=[];
    rate: number = 0;
    starBox: any = [];
    disable_rate: boolean = false;
    feedback: any = '';
    feedback_text: any = '';
    errFeedback: any = '';
    post_id: any;
    booking_id: any;
    to_userid: any;
    to_username: any;
    to_userimage: any;

    constructor(
        public allServicesService: AllServicesService,
        public storage: Storage,
        public router: Router,
        public modalController: ModalController,
        public alertController: AlertController,
        public navCtrl: NavController,
        public route: ActivatedRoute,
        private navParams: NavParams
    ) {
        this.starBox = [1, 2, 3, 4, 5];

        this.booking_id = this.navParams.get('booking_id');
        this.to_userid = this.navParams.get('to_userid');
        this.to_username = this.navParams.get('to_username');
        this.to_userimage = this.navParams.get('to_userimage');
    }

    ngOnInit() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
            } else {
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });
    }

    selectStar(rate, $event) {
        // if($event.offsetX > 26){
        //   this.rate = rate + 1;
        // }else{
        //   this.rate = rate + .5;
        // }

        this.rate = rate + 1;
        console.log(this.rate);
    }

    validate_feedback() {
        if (this.feedback == '' && this.rate < 4) {
            this.errFeedback = 'Please enter your feedback';
        } else {
            this.errFeedback = '';
        }
    }

    rateDoc() {

        if (this.feedback == '' && this.rate < 4) {
            this.errFeedback = 'Please enter your feedback';
            return false;
        } else {
            this.errFeedback = '';
        }

        var formvalue = {
            "token": this.user.token,
            "booking_id": this.booking_id,
            "to_userid": this.to_userid,
            "rating": this.rate,
            "feedback": this.feedback,
            "user_role": this.user.role,
            "type": 'delivery'
        }

        this.allServicesService.showLoader();
        this.allServicesService.sendData('rate_to', formvalue).subscribe(
            result => {
                let rs: any = [];
                rs = result;
                console.log("result here", result);
                if (rs.status == "ok") {
                    this.allServicesService.presentAlert(rs.success_msg);
                    this.allServicesService.dismissLoading();
                    this.feedback_text = this.feedback;
                    this.feedback = '';
                    this.closeModal('ok');
                }
            }, err => {
                console.log("Error  == ", err);
                this.allServicesService.dismissLoading();
                if (err.error.error_code == "user_expire") {
                    this.storage.clear();
                    this.router.navigate(['/signin'])
                }
                this.allServicesService.presentAlert(err.error.errormsg);
            }
        );
    }

    async closeModal(action) {
        // if (action == 'ok') {

        // }
        await this.modalController.dismiss({ action: action });
    }

}

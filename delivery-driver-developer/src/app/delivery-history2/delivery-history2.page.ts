import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { Routes, RouterModule, ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, NavController, Platform, MenuController } from "@ionic/angular";
import { AllServicesService } from "../all-services.service";

@Component({
    selector: 'app-delivery-history2',
    templateUrl: './delivery-history2.page.html',
    styleUrls: ['./delivery-history2.page.scss'],
})
export class DeliveryHistory2Page implements OnInit {

    ready: boolean;
    user: any = [];
    res: any = [];
    duration: any = '';
    bookings: any = [];
    page_title: any='';

    constructor(
        public menuCtrl: MenuController,
        public alertCtrl: AlertController,
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        public storage: Storage
    ) {

        this.route.queryParams.subscribe(params => {
            let queryData: any = []
            queryData = params;
            if (queryData.duration) {
                this.duration = queryData.duration;
                if(this.duration == 'today'){
                    this.page_title = "Today History";
                }else if(this.duration == 'last_week'){
                    this.page_title = "Last Week History";
                }else if(this.duration == 'last_month'){
                    this.page_title = "Last Month History";
                }else if(this.duration == 'last_year'){
                    this.page_title = "Last Year History";
                }else if(this.duration == 'all'){
                    this.page_title = "All History";
                }else{
                    this.page_title = "";
                }
            }else{
                this.duration = '';
            }
        });

        this.storage.get("user").then((userInfo) => {
            if (userInfo != null) {
                this.user = userInfo;
                this.allServicesService.SaveAutoConfiqure(this.user.token);
                if(this.duration !=''){
                    this.getBookingHistory();
                }
            }
        },
            (err) => { }
        );

    }

    ngOnInit() {
    }

    async getBookingHistory() {
        this.ready = false;
        this.allServicesService.getData("getBookingHistory/?type=user&token=" + this.user.token + "&duration=" + this.duration).subscribe((data) => {
            this.res = data;
            console.log(this.res);
            if ((this.res.status = "ok")) {
                this.ready = true;
                this.bookings = this.res.bookings;
            }
        },
            (err) => {
                this.ready = true;
                if (err.error.error_code == "user_expire") {
                    this.router.navigate(["/signin"]);
                }
                this.allServicesService.presentAlert(err.error.errormsg);
            }
        );
    }

}

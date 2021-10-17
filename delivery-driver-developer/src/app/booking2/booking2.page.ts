import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Routes, RouterModule, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Events, AlertController, LoadingController, NavController, ModalController, Platform, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { UpdateStatusPage } from '../update-status/update-status.page';
import { ReviewPage } from '../review/review.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
    selector: 'app-booking2',
    templateUrl: './booking2.page.html',
    styleUrls: ['./booking2.page.scss'],
})
export class Booking2Page implements OnInit {
    @ViewChild('map', { static: false }) mapElement: ElementRef;
    map: any;
    directionsDisplay = new google.maps.DirectionsRenderer;

    date: any;
    daysInThisMonth: any;
    daysInLastMonth: any;
    daysInNextMonth: any;
    weekNames: any;
    monthNames: string[];
    currentMonth: any;
    currentYear: any;
    currentDate: any;

    startdate: any;
    enddate: any;
    isSelected: any;
    isday: any;

    res: any;
    ready: boolean = false;

    user: any;
    booking: any = [];

    selected_date: any;
    status: any;
    booking_id: any = 0;

    rate: number = 0;
    starBox: any = [];

    marker: any = [];
    latitude: any = 35.962639;
    longitude: any = -83.916718;

    constructor(
        public menuCtrl: MenuController,
        public alertCtrl: AlertController,
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        public modalController: ModalController,
        public location: Location,
        public storage: Storage,
        public events: Events,
        private geolocation: Geolocation
    ) {

        this.storage.get("user").then(
            (userInfo) => {
                if (userInfo != null) {
                    this.user = userInfo;
                    this.allServicesService.SaveAutoConfiqure(this.user.token);
                } else {
                }
            },
            (err) => { }
        );

        this.starBox = [1, 2, 3, 4, 5];

        this.booking_id = this.route.snapshot.parent.paramMap.get('booking_id');

        this.events.subscribe('update_order_status_event', (user) => {
            this.GetBooking();
        });
        // setTimeout(
        //     (z) => {
        //         this.GetLocation();
        //     }, 1000);
    }

    ngOnInit() {

    }
    ionViewWillEnter() {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.GetBooking();
            } else {
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });
    }

    GetBooking() {
        this.allServicesService.getData('GetMyBookings/?type=user&token=' + this.user.token + '&booking_id=' + this.booking_id).subscribe(data => {
            this.res = data;
            console.log(this.res);
            if (this.res.status = 'ok') {
                this.ready = true;
                this.booking = this.res.booking;
                this.rate = this.booking[0].rating;

                if (this.res.view_type == 'barber') {
                    this.latitude = this.booking[0].user_map_lat;
                    this.longitude = this.booking[0].user_map_lng;
                }

                if (this.res.view_type == 'customer') {
                    this.latitude = this.booking[0].driver_map_lat;
                    this.longitude = this.booking[0].driver_map_lng;
                    // alert(this.latitude+'===='+this.longitude);
                }
                setTimeout(
                    (z) => {
                        this.initMap();
                    }, 1000);
            }
        }, (err) => {
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.router.navigate(['/signin']);
            }
            this.allServicesService.presentAlert(err.error.errormsg);
        })
    }

    selectDate(day) {
        this.startdate = '';
        this.enddate = '';
        this.isSelected == true;
        this.isday = day;
        let thisDate1 = this.date.getFullYear() + "/" + (this.date.getMonth() + 1) + "/" + day;
        let d = new Date(thisDate1);
        let n = d.getDay();
        this.selected_date = (this.date.getMonth() + 1) + '/' + day + '/' + this.date.getFullYear();
        console.log(this.selected_date);
    }


    async ProcessBooking(status, booking_id) {
        if (status == 1) {
            this.status = "Confirm";
        }

        if (status == 3) {
            this.status = "Decline";
        }

        if (status == 4) {
            this.status = "Start";
        }

        if (status == 1) {
            this.status = "Complete";
        }
        const alert = await this.alertCtrl.create({
            header: this.status,
            message: 'Are you sure ?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.UpdateBooking(booking_id, status);
                    }
                }
            ]
        });

        await alert.present();
    }


    UpdateBooking(booking_id, status) {
        let data_post = {
            token: this.user.token,
            booking_id: booking_id,
            status: status
        };
        this.allServicesService.sendData('UpdateBooking', data_post).subscribe(data => {
            this.res = data;
            console.log(this.res);
            if (this.res.status = 'ok') {
                this.GetBooking();
                this.allServicesService.presentAlert(this.res.msg);
            }
        }, (err) => {
            console.log(err.error);
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.router.navigate(['/signin']);
            }
            if (err.error.booking_update == true) {
                this.GetBooking();
            }
            this.allServicesService.presentAlert(err.error.msg);
        })
    }

    async accept_decline_request(status, booking_id) {
        if (status == 1) {
            this.status = "Confirm";
        }

        if (status == 2) {
            this.status = "Decline";
        }
        const alert = await this.alertCtrl.create({
            header: this.status,
            message: 'Are you sure ?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Yes',
                    handler: () => {

                        let data_post = {
                            token: this.user.token,
                            booking_id: booking_id,
                            status: status
                        };
                        this.allServicesService.showLoader();
                        this.allServicesService.sendData('accept_decline_request', data_post).subscribe(data => {
                            this.allServicesService.dismissLoading();
                            this.res = data;
                            console.log(this.res);
                            if (this.res.status = 'ok') {
                                this.GetBooking();
                                this.allServicesService.presentAlert(this.res.msg);
                            }
                        }, (err) => {
                            console.log(err.error);
                            this.allServicesService.dismissLoading();
                            this.ready = true;
                            if (err.error.error_code == "user_expire") {
                                this.router.navigate(['/signin']);
                            }
                            if (err.error.booking_update == true) {
                                this.GetBooking();
                            }
                            this.allServicesService.presentAlert(err.error.msg);
                        })
                    }
                }
            ]
        });

        await alert.present();
    }

    onRateChange($event) {
        console.log($event);
    }

    async update_status_modal(action, order_status, booking_id, drivery_photo_proof_id, drivery_photo_proof_url) {
        const modal = await this.modalController.create({
            component: UpdateStatusPage,
            componentProps: {
                action: action,
                order_status: order_status,
                booking_id: booking_id,
                drivery_photo_proof_id: drivery_photo_proof_id,
                drivery_photo_proof_url: drivery_photo_proof_url
            },
            cssClass: 'update_status_modal'
        });

        modal.onDidDismiss().then((res) => {
            let modal_response: any = [];
            modal_response = res;
            console.log("modal_response: " + JSON.stringify(modal_response));
        });

        return await modal.present();
    }

    async review_modal(booking_id, to_userid, to_username, to_userimage) {
        const modal = await this.modalController.create({
            component: ReviewPage,
            componentProps: {
                booking_id: booking_id,
                to_userid: to_userid,
                to_username: to_username,
                to_userimage: to_userimage
            },
            cssClass: 'review_modal'
        });

        modal.onDidDismiss().then((res) => {
            let modal_response: any = [];
            modal_response = res;
            console.log("modal_response: " + JSON.stringify(modal_response));
            if (modal_response.data.action == 'ok') {
                this.GetBooking();
            }
        });

        return await modal.present();
    }


    // async make_payment(booking_id, barber_id, order_total, delivery_fees) {
    //     console.log('booking_id: '+booking_id);

    //     let queryData: any = [];
    //     queryData['booking_id'] = booking_id;
    //     queryData['barber_id'] = barber_id;
    //     queryData['total'] = parseFloat(order_total) + parseFloat(delivery_fees);

    //     let navigationExtras: NavigationExtras = {
    //         queryParams: queryData
    //     };
    //     this.router.navigate(['make-payment'], navigationExtras);
    // }



    async make_payment(booking_id, barber_id, total, order_total, delivery_fees) {
        console.log('booking_id: ' + booking_id);

        this.router.navigate(['/make-payment', {
            booking_id: booking_id,
            barber_id: barber_id,
            delivery_fees: delivery_fees,
            order_amount: order_total,
            total: total
        }]);
    }

    GetLocation() {
        this.initMap();
        this.geolocation.getCurrentPosition().then((resp) => {

            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
            this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
        }).catch((error) => {
            this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
        });
    }

    async initMap() {
        this.map = new google.maps.Map(document.getElementById('map_booking2'), {
            zoom: 6,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            center: {
                lat: this.latitude,
                lng: this.longitude
            }
        });
        this.directionsDisplay.setMap(this.map);
        google.maps.event.addListener(this.map, 'idle', () => {
            this.latitude = this.map.getBounds().getCenter().lat();
            this.longitude = this.map.getBounds().getCenter().lng();

        });
    }

    report_driver(booking_id, driver_id) {
        this.router.navigate(['/report-driver', {
            booking_id: booking_id,
            driver_id: driver_id,
        }]);
    }
    
}

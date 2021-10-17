import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Events, AlertController, Platform, MenuController, NavController, ModalController } from '@ionic/angular';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { NavigationExtras } from '@angular/router';
// import { Geolocation } from '@ionic-native/geolocation';
import { GalleryCustomModalPage } from '../gallery-custom-modal/gallery-custom-modal.page';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

declare var google;
@Component({
    selector: 'app-barberprofile',
    templateUrl: './barberprofile.page.html',
    styleUrls: ['./barberprofile.page.scss'],
})
export class BarberprofilePage implements OnInit {
    @ViewChild('map_provideview', { static: false }) mapElement: ElementRef;
    map: any;
    marker: any;
    mapView: boolean = false;
    directionsDisplay = new google.maps.DirectionsRenderer;
    date: any;
    daysInThisMonth: any;
    daysInLastMonth: any;
    daysInNextMonth: any;
    list: any = [];
    weekNames: any;
    monthNames: string[];
    currentMonth: any;
    currentYear: any;
    currentDate: any;
    userDetails: any = [];
    is_private: boolean = false;
    type: any;
    user: any = [];
    ready: boolean = false;
    user_info: any = [];
    res: any;
    user_id: any;

    res_gallery: any;
    gallery: any = [];

    is_monday: boolean = false;
    is_tuesday: boolean = false;
    is_wednesday: boolean = false;
    is_thursday: boolean = false;
    is_friday: boolean = false;
    is_saturdy: boolean = false;
    is_sunday: boolean = false;

    monday: any
    tuesday: any
    wednesday: any
    thursday: any
    friday: any
    saturdy: any
    sunday: any;
    is_map: boolean = false;

    is_login: boolean = false;

    userProfile: any;

    constructor(
        public storage: Storage,
        private callNumber: CallNumber,
        public menuCtrl: MenuController,
        private route: ActivatedRoute,
        public navctrl: NavController,
        public location: Location,
        public router: Router,
        private launchNavigator: LaunchNavigator,
        public allServicesService: AllServicesService,
        public modalController: ModalController,
        public alertCtrl: AlertController
    ) {

        this.route.params.subscribe(data => {
            console.log("ROUTE ====== ", data);
            if (data.id) {
                this.user_id = data.id;
                this.type = 'public';
            } else {
                this.type = this.route.snapshot.parent.paramMap.get('type');
                this.user_id = this.route.snapshot.parent.paramMap.get('user_id');
            }
        })

        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.is_login = true;
                this.user = userInfo;
                this.allServicesService.showLoader();
                this.allServicesService.SaveAutoConfiqure(this.user.token);
                this.allServicesService.getSecoondUserInfo(this.user.token, this.user_id).subscribe((result) => {
                    this.userProfile = result;
                    this.ready = true;
                    this.allServicesService.dismissLoading();
                }, (err) => {
                    this.allServicesService.dismissLoading();
                    console.log("error...", err);
                    let msg = err.error.errormsg;
                    this.allServicesService.presentAlert(msg);
                });
            } else {
                this.is_login = false;
            }
        }, err => {
            this.is_login = false;
        });

        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.date = new Date();
        this.getDaysOfMonth();

    }

    initMap(map_lat, map_lng) {
        // console.log(" MAP PROPERTIES ================= "+JSON.stringify(this.properties));
        this.map = new google.maps.Map(document.getElementById('map_provideview'), {
            zoom: 10,
            center: {
                lat: map_lat,
                lng: map_lng
            }
        });
        this.directionsDisplay.setMap(this.map)

        const icon = {
            url: '/assets/imgs/marker.png', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
        };

        const pos = {
            lat: map_lat,
            lng: map_lng,
        };
        console.log(pos);

        this.marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            icon: icon
        });

    }

    getDaysOfMonth() {
        this.daysInThisMonth = new Array();
        this.daysInLastMonth = new Array();
        this.daysInNextMonth = new Array();
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        if (this.date.getMonth() === new Date().getMonth()) {
            this.currentDate = new Date().getDate();
        } else {
            this.currentDate = 999;
        }

        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth.push(i);
        }

        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            this.daysInThisMonth.push(i + 1);
        }

        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth.push(i + 1);
        }
        var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
        if (totalDays < 36) {
            for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
                this.daysInNextMonth.push(i);
            }
        }
    }
    goToLastMonth() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.getDaysOfMonth();
    }

    goToNextMonth() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.getDaysOfMonth();
    }

    ionViewWillEnter() {

        if (this.type == "private") {
            this.is_private = true;
            this.RenderProfileData();
        } else {
            this.is_private = false;
            this.GetUserProfile(this.user_id);
        }

    }

    slideOptsmulti = {
        loop: false,
        slidesPerView: 3,
        slidesPerGroup: 3,
        grabCursor: true,
        spaceBetween: 10
    };
    
    ngOnInit() {

    }

    RenderProfileData() {

        this.storage.get('user_profile').then(user_profile => {
            if (user_profile != null) {
                this.is_login = true;
                this.ready = true;
                this.user_info = user_profile;

                console.log(this.user_info);
                // this.userWorkingDaytime(this.user_info);
                this.GetUserProfile(this.user.token);
            } else {
                this.is_login = false;
            }
        }, err => {
            this.is_login = false;
        });
    }

    GetUserProfile(user_id) {

        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;

                this.is_login = true;
            } else {
                this.is_login = false;
            }
        }, err => {
            this.is_login = false;
        });
        this.allServicesService.getData('getProfile/?token=' + user_id + '&type=' + this.type).subscribe(data => {
            this.res = data;
            if (this.res.status = 'ok') {
                this.ready = true;
                this.user_info = this.res;
                this.is_map = this.user_info.is_map;
                // this.userWorkingDaytime(this.user_info);
                // this.GetUserProfileImages(user_id);
                // this.GetServices(user_id);
                if (this.type == "private") {
                    this.storage.set('user_profile', this.res);
                }
                if (this.is_map) {
                    setTimeout(
                        (z) => {
                            this.initMap(this.user_info.map_lat, this.user_info.map_lng)
                        }, 1000);
                }

            }
        }, (err) => {
            this.ready = true;
            this.allServicesService.presentAlert(err.error.errormsg);
            if (err.error.error_code == "user_expire") {
                this.location.back();
            }
        })
    }


    async GetUserProfileImages(user_id) {
        this.allServicesService.getData('getPhotos/?token=' + user_id + '&type=' + this.type).subscribe(data => {
            this.res_gallery = data;
            if (this.res_gallery.status = 'ok') {
                this.gallery = this.res_gallery.images;
            }
        }, (err) => {

            this.allServicesService.presentAlert(err.error.errormsg);
            if (err.error.error_code == "user_expire") {
                this.location.back();
            }
        })
    }

    userWorkingDaytime(user_profile) {
        if (user_profile.working.is_sunday != false) {
            this.is_sunday = true;
            this.sunday = user_profile.working.is_sunday;
        } else {
            this.is_sunday = false;
        }

        if (user_profile.working.is_monday != false) {
            this.is_monday = true;
            this.monday = user_profile.working.is_monday;
        } else {
            this.is_monday = false;
        }

        if (user_profile.working.is_tuesday != false) {
            this.is_tuesday = true;
            this.tuesday = user_profile.working.is_tuesday;
        } else {
            this.is_tuesday = false;
        }


        if (user_profile.working.is_wednesday != false) {
            this.is_wednesday = true;
            this.wednesday = user_profile.working.is_wednesday;
        } else {
            this.is_wednesday = false;
        }

        if (user_profile.working.is_thursday != false) {
            this.is_thursday = true;
            this.thursday = user_profile.working.is_thursday;
        } else {
            this.is_thursday = false;
        }

        if (user_profile.working.is_friday != false) {
            this.is_friday = true;
            this.friday = user_profile.working.is_friday;
        } else {
            this.is_friday = false;
        }

        if (user_profile.working.is_saturdy != false) {
            this.is_saturdy = true;
            this.saturdy = user_profile.working.is_saturdy;
        } else {
            this.is_saturdy = false;
        }

    }


    sendToMessage(userProfile) {
        this.storage.get('user').then((val) => {
            console.log(val);
            if (val != null) {
                this.allServicesService.showLoader();
                this.allServicesService.getCurrentUserInfo(val.token).subscribe((result) => {
                    this.res = result;
                    console.log(userProfile);
                    this.openChatPage(userProfile, this.res.result);
                    this.allServicesService.dismissLoading();
                }, (err) => {
                    this.allServicesService.dismissLoading();
                    console.log("error...", err);
                    let msg = err.error.errormsg;
                    this.allServicesService.presentAlert(msg);
                });
            }
        });
    }

    openChatPage(userProfile, Currentuser) {
        let userPro = {
            first_name: userProfile.first_name + '' + userProfile.last_name,
            id: parseInt(userProfile.id),
            user_img: userProfile.user_img
        };
        let navigationExtras: NavigationExtras = {
            queryParams: {
                //  special: JSON.stringify(workout),
                secondUser: JSON.stringify(userPro),
                currentUser: JSON.stringify(Currentuser),
                fromMy: true
            }
        };
        console.log(userProfile, 'user', Currentuser);
        this.navctrl.navigateForward(['/chat'], navigationExtras);
    }
    async open_gallery_modal(index, gallery) {
        console.log('index', index);
        console.log('gallery', gallery);
        const modal = await this.modalController.create({
            component: GalleryCustomModalPage,
            componentProps: { index: index, gallery: gallery },
            cssClass: 'gallery_modal'
        });
        return await modal.present();
    }

    call(phone) {
        if (phone != '') {
            this.callNumber.callNumber(phone, true)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => console.log('Error launching dialer', err));
        }
    }


    async GetServices(user_id) {
        this.allServicesService.getData('getUserServices/?type=' + this.type + '&token=' + user_id).subscribe(data => {
            this.res = data;
            console.log(this.res);
            if (this.res.status = 'ok') {
                this.ready = true;
                this.list = this.res.list;
            }
        }, (err) => {
            this.ready = true;
            if (err.error.error_code == "user_expire") {
                this.router.navigate(['/signin']);
            }
            this.allServicesService.presentAlert(err.error.errormsg);
        })
    }

    GotoNavigator(user_info) {
        let options: LaunchNavigatorOptions = {
        }
        let address = user_info.shop_address1 + " " + user_info.shop_address2 + " " + user_info.shop_city + " " + user_info.shop_state + " USA";
        this.launchNavigator.navigate(address, options)
            .then(
                success => console.log('Launched navigator'),
                error => console.log('Error launching navigator', error)
            );
    }

}

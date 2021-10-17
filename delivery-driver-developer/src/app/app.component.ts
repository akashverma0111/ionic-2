import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Events, MenuController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
//import  firebase from 'firebase/app';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent {
    appPages: Array<{ title: string, url: any, icon: any }>;
    logout: any;
    userDetails: any;
    is_offer: boolean = false;


    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private menu: MenuController,
        public navCtrl: NavController,
        private oneSignal: OneSignal,
        public alertController: AlertController,
        public storage: Storage,
        public events: Events,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            //this.statusBar.styleDefault();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#021a3d');
            this.oneSignal.startInit('1877ddb0-c23a-42f3-9fcb-9b4e1d9c50a2');
            //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
            this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
            this.oneSignal.endInit();

            var firebaseConfig = {
                apiKey: "AIzaSyCK2eK_2inZZdI9QaEYsmzQvCM2H2hRS-8",
                authDomain: "delivery-driver-bab49.firebaseapp.com",
                databaseURL: "https://delivery-driver-bab49-default-rtdb.firebaseio.com",
                projectId: "delivery-driver-bab49",
                storageBucket: "delivery-driver-bab49.appspot.com",
                messagingSenderId: "434514404477",
                appId: "1:434514404477:web:ccef504c52eeff08ef3d14"
            };
            // Initialize Firebase
            //firebase.initializeApp(firebaseConfig);

            setTimeout(() => {
                this.splashScreen.hide();
            }, 1000);

            this.storage.get('user').then(userInfo => {
                if (userInfo != null) {
                    this.events.publish('userCheck:created', userInfo);
                    if (!this.is_offer) {

                        if (userInfo.role == 'barber') {
                            if (userInfo.completed_step == '' || userInfo.completed_step == null || userInfo.completed_step == 'basic_info') {
                                this.router.navigate(['/car-info']);
                            } else if (userInfo.completed_step == 'vehicle_info') {
                                this.router.navigate(['/document-info']);
                            } else if (userInfo.completed_step == 'document_info') {
                                this.router.navigate(['/background-check-edit']);
                            } else if (userInfo.completed_step == 'background_check') {
                                this.router.navigate(['/background-check-ques']);
                            } else if (userInfo.completed_step == 'background_check_ques') {
                                this.router.navigate(['/profile-popup']);
                            } else {
                                this.router.navigate(['/tabs/shop']);
                            }
                        } else {
                            this.router.navigate(["/tabs/home-user"]);
                        }

                    }
                    //services
                } else {
                    this.events.publish('userCheck:created', 'userNotLogin');
                    if (!this.is_offer) {
                        this.router.navigate(['/tutorial']);
                    }
                    this.router.navigate(['/tutorial']);
                }

            });
        });

        this.events.subscribe('userCheck:created', (user) => {
            this.logout = true;
            if (user.token) {
                if (user.role == "barber") {
                    this.appPages = [
                        {
                            title: 'Home',
                            url: '/tabs/shop',
                            icon: 'home'
                        },
                        {
                            title: 'Profile Complete',
                            url: '/profile-popup',
                            icon: 'home'
                        },
                        {
                            title: 'Account',
                            url: '/account',
                            icon: 'person'
                        },
                        {
                            title: 'My Profile',
                            url: '/barberprofile/' + user.user_id + '/private',
                            icon: 'person'
                        },
                        {
                            title: 'My Payment info',
                            url: '/managebankcards',
                            icon: 'card'
                        },
                        {
                            title: 'My Wallet',
                            url: '/wallet',
                            icon: 'card'
                        },
                        // {
                        //   title: 'Contact',
                        //   url: '/contact',
                        //   icon: 'mail'
                        // },

                        {
                            title: 'signin-signup',
                            url: '/signin-signup',
                            icon: 'person'
                        },
                        {
                            title: 'Tutorial',
                            url: '/tutorial',
                            icon: 'person'
                        },
                        {
                            title: 'FAQ',
                            url: '/faq',
                            icon: 'person'
                        },
                        {
                            title: 'About',
                            url: '/about',
                            icon: 'person'
                        },
                        {
                            title: 'Contact Page',
                            url: '/contact-page',
                            icon: 'person'
                        },
                        {
                            title: 'News',
                            url: '/news',
                            icon: 'paper'
                        },
                        {
                            title: 'Change Password',
                            url: '/change-password',
                            icon: 'person'
                        },
                        {
                            title: 'Trip Driver',
                            url: '/trip-driver',
                            icon: 'person'
                        },
                        {
                            title: 'Delivery Info',
                            url: '/delivery-info',
                            icon: 'person'
                        },
                        {
                            title: 'Report Company',
                            url: '/report-company',
                            icon: 'person'
                        },
                        {
                            title: 'Report Driver',
                            url: '/report-driver',
                            icon: 'person'
                        },
                        {
                            title: 'Delivery History',
                            url: '/delivery-history',
                            icon: 'person'
                        },
                        {
                            title: 'Schedule Delivery',
                            url: '/schedule-delivery',
                            icon: 'person'
                        },
                        {
                            title: 'View Status',
                            url: '/view-status',
                            icon: 'person'
                        },
                        {
                            title: 'Cards',
                            url: '/cards',
                            icon: 'person'
                        },
                        {
                            title: 'Update Status',
                            url: '/update-status',
                            icon: 'person'
                        },
                        {
                            title: 'Vehicle Info',
                            url: '/vehicle-info',
                            icon: 'person'
                        },
                        // {
                        //   title: 'Vehicle Information',
                        //   url: '/vehicle-information',
                        //   icon: 'person'
                        // },
                        {
                            title: 'Accepted Delivery',
                            url: '/accepted-delivery',
                            icon: 'person'
                        },
                        {
                            title: 'Car Info',
                            url: '/car-info',
                            icon: 'person'
                        },
                        {
                            title: 'add-order-details ',
                            url: '/add-order-details',
                            icon: 'person'
                        },
                    ]
                } else {
                    this.appPages = [
                        // {
                        //     title: 'driverselect',
                        //     url: '/driverselect/1',
                        //     icon: 'home'
                        // },
                        {
                            title: 'Home',
                            url: '/tabs/shop',
                            icon: 'home'
                        },
                        // {
                        //   title: 'Notifications',
                        //   url: '/notifications',
                        //   icon: 'notifications'
                        // },  
                        {
                            title: 'Home User',
                            url: '/home-user',
                            icon: 'person'
                        },
                        {
                            title: 'Notification',
                            url: '/notification',
                            icon: 'notifications'
                        },
                        {
                            title: 'My Profile',
                            url: '/barberprofile/' + user.user_id + '/private',
                            icon: 'person'
                        },
                        {
                            title: 'My Payment info',
                            url: '/managebankcards',
                            icon: 'card'
                        },
                        {
                            title: 'My Wallet',
                            url: '/wallet',
                            icon: 'card'
                        },
                        {
                            title: 'Review',
                            url: '/review',
                            icon: 'paper'
                        },
                        {
                            title: 'signin-signup',
                            url: '/signin-signup',
                            icon: 'person'
                        },
                        {
                            title: 'Tutorial',
                            url: '/tutorial',
                            icon: 'person'
                        },
                        {
                            title: 'FAQ',
                            url: '/faq',
                            icon: 'person'
                        },
                        {
                            title: 'About',
                            url: '/about',
                            icon: 'person'
                        },
                        {
                            title: 'Contact Page',
                            url: '/contact-page',
                            icon: 'person'
                        },
                        {
                            title: 'News',
                            url: '/news',
                            icon: 'paper'
                        },
                        {
                            title: 'Change Password',
                            url: '/change-password',
                            icon: 'person'
                        },
                        {
                            title: 'Trip Driver',
                            url: '/trip-driver',
                            icon: 'person'
                        },
                        {
                            title: 'Home',
                            url: '/tabs/shop',
                            icon: 'home'
                        },
                        {
                            title: 'Profile Complete',
                            url: '/profile-popup',
                            icon: 'home'
                        },
                        {
                            title: 'Account',
                            url: '/account',
                            icon: 'person'
                        },
                        {
                            title: 'Notification',
                            url: '/notification',
                            icon: 'notifications'
                        },
                        {
                            title: 'My Profile',
                            url: '/barberprofile/' + user.user_id + '/private',
                            icon: 'person'
                        },
                        {
                            title: 'My Payment info',
                            url: '/managebankcards',
                            icon: 'card'
                        },
                        {
                            title: 'My Wallet',
                            url: '/wallet',
                            icon: 'card'
                        },
                        // {
                        //   title: 'Contact',
                        //   url: '/contact',
                        //   icon: 'mail'
                        // },

                        {
                            title: 'signin-signup',
                            url: '/signin-signup',
                            icon: 'person'
                        },
                        {
                            title: 'Tutorial',
                            url: '/tutorial',
                            icon: 'person'
                        },
                        {
                            title: 'FAQ',
                            url: '/faq',
                            icon: 'person'
                        },
                        {
                            title: 'About',
                            url: '/about',
                            icon: 'person'
                        },
                        {
                            title: 'Contact Page',
                            url: '/contact-page',
                            icon: 'person'
                        },
                        {
                            title: 'News',
                            url: '/news',
                            icon: 'paper'
                        },
                        {
                            title: 'Change Password',
                            url: '/change-password',
                            icon: 'person'
                        },
                        {
                            title: 'Trip Driver',
                            url: '/trip-driver',
                            icon: 'person'
                        },
                        {
                            title: 'Delivery Info',
                            url: '/delivery-info',
                            icon: 'person'
                        },
                        {
                            title: 'Report Company',
                            url: '/report-company',
                            icon: 'person'
                        },
                        {
                            title: 'Report Driver',
                            url: '/report-driver',
                            icon: 'person'
                        },
                        {
                            title: 'Delivery History',
                            url: '/delivery-history',
                            icon: 'person'
                        },
                        {
                            title: 'Schedule Delivery',
                            url: '/schedule-delivery',
                            icon: 'person'
                        },
                        {
                            title: 'View Status',
                            url: '/view-status',
                            icon: 'person'
                        },
                        {
                            title: 'Cards',
                            url: '/cards',
                            icon: 'person'
                        },
                        {
                            title: 'Update Status',
                            url: '/update-status',
                            icon: 'person'
                        },
                        {
                            title: 'Vehicle Info',
                            url: '/vehicle-info',
                            icon: 'person'
                        },
                        // {
                        //   title: 'Vehicle Information',
                        //   url: '/vehicle-information',
                        //   icon: 'person'
                        // },
                        {
                            title: 'Accepted Delivery',
                            url: '/accepted-delivery',
                            icon: 'person'
                        },
                        {
                            title: 'Car Info',
                            url: '/car-info',
                            icon: 'person'
                        },
                        {
                            title: 'add-order-details ',
                            url: '/add-order-details',
                            icon: 'person'
                        },
                    ]
                }

            }
            if (user == 'userNotLogin') {

                this.logout = false;
                this.appPages = [


                    {
                        title: 'Home',
                        url: '/tabs/shop',
                        icon: 'home'
                    },
                    {
                        title: 'Contact',
                        url: '/contact',
                        icon: 'mail'
                    },
                    {
                        title: 'About',
                        url: '/about',
                        icon: 'person'
                    },
                    {
                        title: 'News',
                        url: '/news',
                        icon: 'paper'
                    },
                    {
                        title: 'Login / Signup',
                        url: '/home',
                        icon: 'person'
                    },

                ]
            }
        });


    }

    private onPushReceived(payload: OSNotificationPayload) {
        console.log('Push recevied:' + payload.additionalData);
    }

    openForm() {
        this.navCtrl.navigateForward(['/forms', { form_id: 1 }]);
    }

    private onPushOpened(payload: OSNotificationPayload) {
        this.is_offer = true;
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                let event_notification = payload.additionalData;
                if (event_notification.type == "appointment_complete" || event_notification.type == "appointment_start" || event_notification.type == "appointment_request") {
                    this.router.navigate(['/booking2/' + event_notification.booking_id]);
                } else {
                    if (event_notification.type == "msg_push") {
                        this.router.navigate(['/tabs/messages']);
                    } else {
                        this.router.navigate(['/tabs/shop']);
                    }

                }
            } else {
                this.router.navigate(['/home']);
            }

        }, error => {
            this.router.navigate(['/home']);
        });
    }

    async DoLogout() {
        this.menu.toggle();
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
}
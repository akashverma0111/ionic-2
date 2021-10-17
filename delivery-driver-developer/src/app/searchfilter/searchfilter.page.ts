import { Component, OnInit } from "@angular/core";
import { ViewChild, ElementRef, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { Routes, RouterModule, ActivatedRoute } from "@angular/router";
import { AllServicesService } from "../all-services.service";
import {
    AlertController,
    LoadingController,
    NavController,
    MenuController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";

declare var google;
@Component({
    selector: "app-searchfilter",
    templateUrl: "./searchfilter.page.html",
    styleUrls: ["./searchfilter.page.scss"],
})
export class SearchfilterPage implements OnInit {
    @ViewChild("map", { static: false }) mapElement: ElementRef;
    map: any;
    mapView: boolean = false;
    directionsDisplay = new google.maps.DirectionsRenderer();
    user: any;
    res: any;
    serviceReady: boolean = false;
    list: any;
    barberReady: any;
    barberlist: any;
    barberlist_map: any;
    marker: any = [];
    latitude: any = 35.962639;
    longitude: any = -83.916718;
    ready: boolean = false;
    searchQuery: any;
    booking: any = [];
    category: any;
    selected_date: any = "";
    isAvailable: any;
    isChecked: boolean;

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        private menu: MenuController,
        private geolocation: Geolocation,
        public alertCtrl: AlertController,
        public storage: Storage
    ) {
        this.storage.get("user").then(
            (userInfo) => {
                if (userInfo != null) {
                    this.user = userInfo;
                    this.allServicesService.SaveAutoConfiqure(this.user.token);
                } else {
                    this.storage.clear();
                    this.router.navigate(['/signin']);
                }
            },
            (err) => { }
        );
        this.GetServices();

        setTimeout((z) => {
            this.GetLocation();
        }, 1000);
    }

    ionViewDidLoad() { }

    ionViewWillEnter() {
        this.menu.enable(true);
        this.storage.get("user").then((userInfo) => {
            if (userInfo != null) {
                this.user = userInfo;
                this.getDriverStatus();
                this.GetBooking();
                this.allServicesService.SaveAutoConfiqure(this.user.token);
            }
        });
    }

    onSegmentChange() {
        this.GetBooking();
        this.GetLocation();
    }

    async GetBooking() {
        this.ready = false;
        this.booking = [];
        this.allServicesService
            .getData(
                "GetMyBookings/?type=barber&token=" +
                this.user.token +
                "&date=" +
                this.selected_date
            )
            .subscribe(
                (data) => {
                    this.res = data;
                    console.log(this.res);
                    if ((this.res.status = "ok")) {
                        this.ready = true;
                        this.booking = this.res.booking;
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

    GetLocation() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                this.initMap();
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
                this.map.setCenter(
                    new google.maps.LatLng(this.latitude, this.longitude)
                );
            })
            .catch((error) => {
                this.map.setCenter(
                    new google.maps.LatLng(this.latitude, this.longitude)
                );
                // this.GetUsers('', '');
            });
    }

    ngOnInit() {
        // this.GetLocation();
        this.category = "map";
    }

    async GetServices() {
        this.allServicesService.getData("getServices").subscribe(
            (data) => {
                this.res = data;
                if ((this.res.status = "ok")) {
                    this.serviceReady = true;
                    this.list = this.res.list;
                }
            },
            (err) => {
                this.serviceReady = true;
                this.allServicesService.presentAlert(
                    "Something went wrong, please inform app admin."
                );
            }
        );
    }

    submitSearch($event) {
        if (typeof this.searchQuery != "undefined") {
            setTimeout((z) => {
                this.navCtrl.navigateForward(["/shop_search/" + this.searchQuery]);
            }, 200);
        }
    }

    clearSearch(e) {
        this.searchQuery = "";
    }

    async initMap() {
        this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 6,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            center: {
                lat: this.latitude,
                lng: this.longitude,
            },
        });
        this.directionsDisplay.setMap(this.map);
        google.maps.event.addListener(this.map, "idle", () => {
            this.latitude = this.map.getBounds().getCenter().lat();
            this.longitude = this.map.getBounds().getCenter().lng();
            //this.GetUsersMap(this.latitude,this.longitude);
        });
    }

    gotosingles(id) {
        console.log("ID ======= " + id);

        this.router.navigate([
            "barberprofile",
            {
                id: id,
            },
        ]);
    }

    getDriverStatus() {
        this.ready = false;
        this.allServicesService.getData('getDriverStatus/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.isAvailable = res.is_available;
            console.log('this.is_available: ', this.isAvailable);
            if (this.isAvailable == true || this.isAvailable == 1) {
                this.isChecked = true;
            } else {
                this.isChecked = false;
            }

        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    ChangeDriverStatus(event) {
        console.log('event.detail.checked: ', event.detail.checked);
        let formdata = {
            token: this.user.token,
            status: event.detail.checked
        }

        this.allServicesService.showLoader();
        this.allServicesService.sendData("updateDriverStatus", formdata).subscribe(
            (data) => {
                this.res = data;
                if ((this.res.status = "ok")) {
                    this.allServicesService.dismissLoading();
                    this.isAvailable = this.res.is_available;
                    if (this.isAvailable == true || this.isAvailable == 1) {
                        this.isChecked = true;
                    } else {
                        this.isChecked = false;
                    }
                }
            },
            (err) => {
                this.allServicesService.dismissLoading();
                this.allServicesService.presentAlert(
                    "Something went wrong, please inform app admin."
                );
            }
        );
    }


    OpenModal(marker) {
        console.log(marker);
    }
    segmentChanged(event) {
        this.category = event;
    }
}

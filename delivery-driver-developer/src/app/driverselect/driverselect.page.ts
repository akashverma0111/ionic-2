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
    selector: "app-driverselect",
    templateUrl: "./driverselect.page.html",
    styleUrls: ["./driverselect.page.scss"],
})
export class DriverselectPage implements OnInit {
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
    location_pickup: any = []
    is_location_pickup: boolean = false;
    location_drop: any = [];
    is_location_drop: boolean = false;
    booking_id: any;
    searchQuery: any;
    category: any;
    rs: any;
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
        this.booking_id = this.route.snapshot.parent.paramMap.get('booking_id');
        this.storage.get("location_drop").then(
            (location_drop) => {
                if (location_drop != null) {
                    this.location_drop = location_drop;
                    this.is_location_drop = true;
                } else {
                    this.router.navigate(["/schedule-delivery"]);
                    this.is_location_drop = false;
                }
            },
            (err) => {
                this.router.navigate(["/schedule-delivery"]);
                this.is_location_drop = false;
            }
        );

        this.storage.get("location_pickup").then(
            (location_pickup) => {
                if (location_pickup != null) {
                    this.location_pickup = location_pickup;
                    this.is_location_pickup = true;
                    this.GetUsersMap(this.location_pickup.lat, this.location_pickup.lng);
                    console.log(this.location_pickup);
                } else {
                    this.is_location_pickup = false;
                    this.router.navigate(["/schedule-delivery"]);
                }
            },
            (err) => {
                this.is_location_pickup = false;
                this.router.navigate(["/schedule-delivery"]);
            }
        );

        this.menu.enable(true);
        this.storage.get("user").then((userInfo) => {
            if (userInfo != null) {
                this.user = userInfo;
                this.allServicesService.SaveAutoConfiqure(this.user.token);
            }
        });
    }

    GetLocation() {
        this.initMap();
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
                this.map.setCenter(
                    new google.maps.LatLng(this.latitude, this.longitude)
                );
                //this.GetUsers(this.latitude, this.longitude);
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
        this.map = new google.maps.Map(
            document.getElementById("map_select_driver"),
            {
                zoom: 6,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                center: {
                    lat: this.latitude,
                    lng: this.longitude,
                },
            }
        );
        this.directionsDisplay.setMap(this.map);
        google.maps.event.addListener(this.map, "idle", () => {
            this.latitude = this.map.getBounds().getCenter().lat();
            this.longitude = this.map.getBounds().getCenter().lng();

        });
    }

    async GetUsersMap(latitude, longitude) {
        //this.marker = [];
        this.allServicesService
            .getData(
                "get_user_role_wise/?type=home_map&role=barber&latitude=" +
                latitude +
                "&longitude=" +
                longitude
            )
            .subscribe(
                (data) => {
                    this.res = data;
                    if ((this.res.status = "ok")) {
                        this.barberReady = true;
                        this.barberlist_map = this.res.list;

                        console.log("BARBER LIST ===== ", this.barberlist_map);
                        this.barberlist_map.forEach((element) => {
                            console.log("ELEMENT ===== ", element);
                            if (element.map_lat != "" && element.map_lng != "") {
                                const icon = {
                                    url: "/assets/imgs/marker.png", // image url
                                    scaledSize: new google.maps.Size(50, 50), // scaled size
                                };

                                let marker = new google.maps.Marker({
                                    position: {
                                        lat: element.map_lat,
                                        lng: element.map_lng,
                                    },
                                    map: this.map,
                                    title: element.shop_name,
                                    icon: icon,
                                    id: element.id,
                                });

                                let title = element.shop_name;
                                let image = element.shop_logo;
                                // let price = element.amount_range;
                                let pid = element.id;

                                var infowindow = new google.maps.InfoWindow();
                                var service = google.maps.places.PlacesService(this.map);
                                google.maps.event.addListener(marker, "click", () => {
                                    var contentString = '<div class="textData"></div>';
                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString,
                                        closeBoxURL: "",
                                        disableAutoPan: true,
                                    });
                                    let div = document.createElement("div");
                                    var img = document.createElement("img");
                                    //   let price = element.amount_range;
                                    div.innerHTML =
                                        "<div id=" +
                                        "propertyInfo" +
                                        " class=" +
                                        "mapDiv" +
                                        ">" +
                                        "<h6>" +
                                        title +
                                        "</h6>" +
                                        "<img class=" +
                                        "mapImg" +
                                        ' src="' +
                                        image +
                                        " >" +
                                        "</div>";

                                    img.setAttribute("class", "img_marker");
                                    img.src = image;
                                    div.appendChild(img);
                                    div.onclick = () => {
                                        this.gotosingles(pid);
                                    };
                                    infowindow.setContent(div);
                                    infowindow.open(this.map, marker);
                                });
                                this.directionsDisplay.setMap(this.map);
                            }
                        });
                    }
                },
                (err) => {
                    this.barberReady = true;
                    this.allServicesService.presentAlert(
                        "Something went wrong, please inform app admin."
                    );
                }
            );
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

    SendInvite(driver_id) {
        let formdata = {
            token: this.user.token,
            booking_id: this.booking_id,
            driver_id: driver_id
        };

        this.allServicesService.showLoader();
        this.allServicesService
            .sendData("InviteDriver/?token=" + this.user.token, formdata)
            .subscribe(
                (data) => {
                    this.allServicesService.dismissLoading();
                    this.rs = data;
                    if ((this.rs.status = "ok")) {
                        //this.router.navigate(["/driverselect/"+this.rs.booking_id]);
                        this.presentAlertConfirm(this.rs.msg);
                    }
                },
                (err) => {
                    this.allServicesService.dismissLoading();
                    if (err.error.error_code == "user_expire") {
                        this.router.navigate(["/signin"]);
                    }
                    this.allServicesService.presentAlert(err.error.errormsg);
                }
            );
    }

    async presentAlertConfirm(msg) {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: msg,
            buttons: [
                {
                    text: 'Send More Invite',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Done',
                    handler: () => {
                        this.router.navigate(["/booking"]);
                    }
                }
            ]
        });

        await alert.present();
    }

    doSomething(ev: any) {
        // console.log("EVENT ====== ", ev);
        // console.log("innerHTML = ", ev.target.innerHTML);
        // console.log("EVENT ====== ", ev.target.textContent);

        // if (ev.target.id) {
        //   var a = parseInt(ev.target.id);
        //   console.log("A ===== "+a);
        //   let index = this.barberlist_map.findIndex(x => x.id == a);

        //   this.router.navigate(['barberprofile',{
        //     id:a
        //   }]);

        //   return false;
        // }
    }

    OpenModal(marker) {
        console.log(marker);
    }
    segmentChanged(event) {
        this.category = event;
    }
}

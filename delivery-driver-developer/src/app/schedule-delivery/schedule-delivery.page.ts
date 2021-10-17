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
    selector: "app-schedule-delivery",
    templateUrl: "./schedule-delivery.page.html",
    styleUrls: ["./schedule-delivery.page.scss"],
})
export class ScheduleDeliveryPage implements OnInit {
    @ViewChild("map_schedulepage", { static: false }) mapElement: ElementRef;
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
    service = new google.maps.places.AutocompleteService();
    searchQuery: any;
    category: any;
    btn_disable_pik: boolean = true;
    btn_disable_drop: boolean = true;

    GoogleAutocomplete: any;
    autocomplete: { input: string; };
    autocomplete_drop: { input: string; };
    autocompleteItems: any = [];
    autocompleteItems_drop: any = [];
    searchedlocation: any = '';
    location_filter: boolean = false;
    locateclass: any;
    geocoder: any;
    pickup_lat: any;
    pickup_lng: any;

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        private menu: MenuController,
        private geolocation: Geolocation,
        private zone: NgZone,
        public alertCtrl: AlertController,
        public storage: Storage
    ) {
        this.storage.get("user").then(
            (userInfo) => {
                if (userInfo != null) {
                    this.user = userInfo;
                    console.log('this.user: '+JSON.stringify(this.user));
                    this.allServicesService.SaveAutoConfiqure(this.user.token);
                    console.log('this.user.address: '+this.user.address);
                    let businessPickupAddress = this.user.address+' '+this.user.address1+' '+this.user.city+' '+this.user.state+' '+this.user.zipcode;
                    this.pickup_lat = this.user.map_lat;
                    this.pickup_lng = this.user.map_lng;
                    
                    if(businessPickupAddress.trim() != ''){
                        this.btn_disable_pik = false;
                        this.autocomplete.input = businessPickupAddress; 
                        this.storage.remove('location_pickup');

                        let location = {
                            item: this.autocomplete.input,
                            type: "autocomplete",
                            lat: this.pickup_lat,
                            lng: this.pickup_lng
                        }
                        this.storage.set('location_pickup', location);
                    }
                } else {
                }
            },
            (err) => { }
        );

        setTimeout((z) => {
            this.GetLocation();
        }, 1000);

        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocomplete_drop = { input: '' };
        this.autocompleteItems = [];
        this.autocompleteItems_drop = [];
        this.geocoder = new google.maps.Geocoder;
    }

    updateSearchResults() {
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            this.searchedlocation = this.autocompleteItems;
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    updateSearchResults_drop() {
        if (this.autocomplete_drop.input == '') {
            this.autocompleteItems_drop = [];
            this.searchedlocation = this.autocompleteItems;
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete_drop.input },
            (predictions, status) => {
                this.autocompleteItems_drop = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems_drop.push(prediction);
                    });
                });
            });
    }

    selectSearchResult(item, type) {

        if (type == "drop") {
            this.autocomplete_drop.input = item.description;
            // this.searchedlocation = item;
            // this.searchedlocation = this.autocompleteItems;
            this.autocompleteItems_drop = [];
        }
        if (type == "pickup") {
            this.autocomplete.input = item.description;
            // this.searchedlocation = item;
            // this.searchedlocation = this.autocompleteItems;
            this.autocompleteItems = [];
        }

        this.location_filter = false;
        this.locateclass = "locate";

        this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
            if (status === 'OK' && results[0]) {
                if (type == "drop") {
                    this.storage.remove('location_drop');
                    let location = {
                        item: item.description,
                        type: "autocomplete",
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                    this.btn_disable_drop = false;
                    this.storage.set('location_drop', location);
                    this.show_marker_on_map(location);
                }
                if (type == "pickup") {
                    this.storage.remove('location_pickup');
                    let location = {
                        item: item.description,
                        type: "autocomplete",
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                    this.pickup_lat = location.lat;
                    this.pickup_lng = location.lng;

                    this.btn_disable_pik = false;

                    this.storage.set('location_pickup', location);
                    this.show_marker_on_map(location);
                }

                this.map.setCenter(results[0].geometry.location);
                console.log("Results Location=" + results[0].geometry.location.lat());

            }
        })


        //this.GetEvents(item);

    }

    show_marker_on_map(location) {
        console.log(location.lat + " show_marker_on_map " + location.lng);
        if (location.lat != "" && location.lng != "") {
            const icon = {
                url: "/assets/imgs/marker.png", // image url
                scaledSize: new google.maps.Size(50, 50), // scaled size
            };

            let marker = new google.maps.Marker({
                position: {
                    lat: location.lat,
                    lng: location.lng,
                },
                map: this.map,
                title: this.user.userImage,
                icon: icon,
            });

            let title = location.item.description;

            google.maps.event.addListener(marker, "click", () => {

                var contentString = '<div class="textData"></div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    closeBoxURL: "",
                    disableAutoPan: true,
                });
                let div = document.createElement("div");
                div.innerHTML = "<div   id='propertyInfo' class='mapDiv'><h6>" + title + "</h6></div>";

                div.onclick = () => {

                };
                infowindow.setContent(div);
                infowindow.open(this.map, marker);
            });
            this.directionsDisplay.setMap(this.map);
        }
    }

    ionViewDidLoad() { }

    ionViewWillEnter() {
        this.menu.enable(true);
        this.storage.get("user").then((userInfo) => {
            if (userInfo != null) {
                this.user = userInfo;
                this.allServicesService.SaveAutoConfiqure(this.user.token);
            } else {
                this.router.navigate(['/signin']);
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

    Confirm() {
        this.storage.get("user").then((userInfo) => {
            if (userInfo != null) {
                let details = {
                    token: userInfo.token,
                    pikup_address: this.autocomplete.input,
                    drop_address: this.autocomplete_drop.input
                }
                
                this.allServicesService.showLoader();

                this.allServicesService.sendData("get_distance_and_time", details).subscribe((data) => {
                    this.allServicesService.dismissLoading();
                    let rs: any = [];

                    rs = data;
                    if ((rs.status = "ok")) {
                        this.router.navigate(['/add-order-details', {
                            pickup_lat: this.pickup_lat,
                            pickup_lng: this.pickup_lng,
                            pikup_address: this.autocomplete.input,
                            drop_address: this.autocomplete_drop.input,
                            distance: rs.distance,
                            duration: rs.duration,
                            total_delivery_fees: rs.total_delivery_fees
                        }]);
                    }
                }, (err) => {
                    this.allServicesService.dismissLoading();
                    if (err.error.error_code == "invalid_token") {
                        this.router.navigate(["/signin"]);
                    }
                    this.allServicesService.presentAlert(err.error.errormsg);
                }

                );
            } else {
                this.router.navigate(['/signin']);
            }
        });
        // this.router.navigate(['/add-order-details', {
        //     pickup_lat: this.pickup_lat,
        //     pickup_lng: this.pickup_lng,
        //     pikup_address: this.autocomplete.input,
        //     drop_address: this.autocomplete_drop.input
        // }]);
    }

    async initMap() {
        this.map = new google.maps.Map(
            document.getElementById("map_schedulepage"),
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

    gotosingles(id) {
        console.log("ID ======= " + id);

        this.router.navigate([
            "barberprofile",
            {
                id: id,
            },
        ]);
    }


    OpenModal(marker) {
        console.log(marker);
    }
    segmentChanged(event) {
        this.category = event;
    }
}

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
    FormGroup,
    Validators,
    FormBuilder,
    FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AllServicesService } from "../all-services.service";
import {
    AlertController,
    LoadingController,
    ModalController,
    Events,
    ToastController,
    Platform,
    ActionSheetController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";

import {
    Camera,
    CameraOptions,
    PictureSourceType,
} from "@ionic-native/Camera/ngx";
import { File, FileEntry } from "@ionic-native/File/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment';

@Component({
    selector: "app-add-order-details",
    templateUrl: "./add-order-details.page.html",
    styleUrls: ["./add-order-details.page.scss"],
})
export class AddOrderDetailsPage implements OnInit {
    user: any;
    serviceaddform: FormGroup;
    rs: any = [];
    post_id: any;
    post: any = [];
    price: any = [];

    form_valid: boolean = false;
    location_drop: [];
    location_pickup: [];

    is_location_drop: boolean = false;
    is_location_pickup: boolean = false;

    imageURI: any;
    images: any = [];
    res_image: any;
    categories: any = [];
    type: any = "service_image";
    post_type: any;
    private currentNumber = 0;
    booking_id: any;
    image_data: any = "https://trubarber.betaplanets.com/wp-content/uploads/2020/03/placeholder.jpg";

    deliveryFees: number;
    orderTotal: number;

    distance: any = null;
    duration: any = null;

    paymentType: any;

    datepicker_startdate: any;
    datepicker_enddate: any;

    constructor(
        private modalController: ModalController,
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        public alertCtrl: AlertController,
        public storage: Storage,
        private route: ActivatedRoute,
        public events: Events,
        private sanitizer: DomSanitizer,
        private camera: Camera,
        private file: File,
        public transfer: FileTransfer,
        private toastController: ToastController,
        private plt: Platform,
        private loadingController: LoadingController,
        private actionSheetController: ActionSheetController,
        private ref: ChangeDetectorRef,
        private filePath: FilePath
    ) {
        // this.index = navParams.get('index');
        // this.gallery = navParams.get('gallery');

        this.datepicker_startdate = moment().format('YYYY-MM-DD');
        this.datepicker_enddate = moment().add(50, 'years').format('YYYY-MM-DD');

    }

    ngOnInit() {
        this.image_data = "https://trubarber.betaplanets.com/wp-content/uploads/2020/03/placeholder.jpg";
        this.post_type = this.route.snapshot.parent.paramMap.get("post_type");
        this.post_id = this.route.snapshot.parent.paramMap.get("post_id");

        this.distance = this.route.snapshot.parent.paramMap.get("distance");
        this.duration = this.route.snapshot.parent.paramMap.get("duration");
        this.deliveryFees = parseFloat(this.route.snapshot.parent.paramMap.get("total_delivery_fees"));
        console.log("distance: "+this.distance);
        console.log("duration: "+this.duration);
        
        this.storage.get("user").then(
            (userInfo) => {
                if (userInfo != null) {
                    this.user = userInfo;
                    if (this.post_id) {
                        this.GetCustomService(this.post_id);
                    } else {
                        this.post_id = 0;
                    }

                    // this.GetServiceCategory();
                } else {
                    this.router.navigate(["/signin"]);
                }
            },
            (err) => {
                this.router.navigate(["/signin"]);
            }
        );

        this.storage.get("location_drop").then(
            (location_drop) => {
                console.log("location_drop: ", location_drop);

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

                console.log("location_pickup: ", location_pickup.item);
                if (location_pickup != null) {
                    this.location_pickup = location_pickup;
                    this.is_location_pickup = true;
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

        this.serviceaddform = new FormGroup({
            pickup_phone: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            delivery_phone: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            date: new FormControl("", Validators.compose([Validators.required])),
            time: new FormControl("", Validators.compose([Validators.required])),
            delivery_fees: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            order_total: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            payment_type: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            order_details: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            order_item: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
            delivery_instructions: new FormControl(
                "",
                Validators.compose([Validators.required])
            ),
        });

        let delivery_date = moment().format('YYYY-MM-DD');
        this.serviceaddform.controls['date'].setValue(delivery_date);    

        let currTime =  moment().format("HH:mm");
        let delivery_time = moment(currTime, 'h:mm A').toISOString();
        this.serviceaddform.controls['time'].setValue(delivery_time);
        
    }

    private increment() {
        this.currentNumber++;
        this.serviceaddform.controls["order_item"].setValue(this.currentNumber);
    }

    private decrement() {
        this.currentNumber--;
        this.serviceaddform.controls["order_item"].setValue(this.currentNumber);
    }

    async closeModal(close: any = "") {
        const onClosedData: string = close;
        await this.modalController.dismiss(onClosedData);
    }

    GetCustomService(post_id) {
        let formdata = {
            post_id: post_id,
        };

        this.allServicesService.showLoader();
        this.allServicesService
            .sendData("GetCustomService/?token=" + this.user.token, formdata)
            .subscribe(
                (data) => {
                    this.allServicesService.dismissLoading();
                    this.rs = data;

                    if ((this.rs.status = "ok")) {
                        if (!this.rs.post) {
                            this.closeModal();
                        } else {
                            this.post = this.rs.post;
                            this.price = this.rs.post_price;
                            this.serviceaddform.controls["service_name"].setValue(
                                this.post.post_title
                            );
                            this.serviceaddform.controls["service_price"].setValue(
                                this.price.price
                            );
                            this.serviceaddform.controls["service_time"].setValue(
                                this.price.time
                            );
                            this.image_data = this.rs.image;
                        }
                        //this.allServicesService.presentAlert(this.rs.msg);
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

    async selectImage(type) {
        this.type = type;
        this.images = [];
        const actionSheet = await this.actionSheetController.create({
            header: "Select Image source",
            buttons: [
                {
                    text: "Load image from Library",
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    },
                },
                {
                    text: "capture image using Camera",
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    },
                },
                {
                    text: "Cancel",
                    role: "cancel",
                },
            ],
        });
        await actionSheet.present();
    }

    takePicture(sourceType: PictureSourceType) {
        var options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true,
        };

        this.camera.getPicture(options).then((imagePath) => {
            if (
                this.plt.is("android") &&
                sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
            ) {
                this.filePath.resolveNativePath(imagePath).then((filePath) => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
                    let currentName = imagePath.substring(
                        imagePath.lastIndexOf("/") + 1,
                        imagePath.lastIndexOf("?")
                    );
                    let smext = currentName.split(".").pop();
                    let ext = smext.toLowerCase();
                    this.copyFileToLocalDir(
                        correctPath,
                        currentName,
                        this.createFileName(ext)
                    );
                });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
                let smext = currentName.split(".").pop();
                let ext = smext.toLowerCase();
                this.copyFileToLocalDir(
                    correctPath,
                    currentName,
                    this.createFileName(ext)
                );
            }
        });
    }

    createFileName(ext) {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + "." + ext;
        return newFileName;
    }

    copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file
            .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
            .then(
                (success) => {
                    this.updateStoredImages(newFileName);
                },
                (error) => {
                    this.presentToast("Error while storing file.");
                }
            );
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: "bottom",
            duration: 3000,
        });
        toast.present();
    }

    updateStoredImages(name) {
        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);

        let newEntry = {
            name: name,
            path: resPath,
            filePath: filePath,
        };

        this.images.push(newEntry);
        this.image_data = resPath;
        console.log(this.images);
        this.ref.detectChanges(); // trigger change detection cycle
    }

    getImgContent() {
        return this.sanitizer.bypassSecurityTrustUrl(this.image_data);
    }

    pathForImage(img) {
        if (img === null) {
            return "";
        } else {
            let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
            return converted;
        }
    }

    UploadImage(post_id, msg) {
        this.allServicesService.showLoader("uploading...");
        if (this.images.length > 0) {
            let _mime_type = "image/jpeg";

            let smext = this.images[0].name.split(".").pop();
            let ext = smext.toLowerCase();

            if (ext == "png") {
                _mime_type = "image/png";
            }

            if (ext == "jpeg") {
                _mime_type = "image/jpeg";
            }

            if (ext == "mov") {
                _mime_type = "video/quicktime";
            }

            if (ext == "mp4") {
                _mime_type = "video/mp4";
            }

            if (ext == "jpg") {
                _mime_type = "image/jpeg";
            }

            const fileTransfer: FileTransferObject = this.transfer.create();
            let header: Headers = new Headers();
            header.append("Authorization", "Bearer " + this.user.token);
            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: post_id + "_featured." + ext,
                chunkedMode: false,
                mimeType: _mime_type,
                params: {
                    type: this.type,
                    user: this.user.user_id,
                    post_id: post_id,
                    ext: ext,
                },
                headers: { Authorization: "Bearer " + this.user.token },
            };

            let url = this.allServicesService.getURL();
            fileTransfer
                .upload(
                    this.images[0].filePath,
                    url + "/wp-json/wp/v2/media?token=" + this.user.token,
                    options
                )
                .then(
                    (data1) => {
                        console.log(data1);
                        this.events.publish("reloadservices", 1);
                        this.allServicesService.presentAlert(msg);
                        this.allServicesService.dismissLoading();
                    },
                    (err) => {
                        console.log(err);
                        this.allServicesService.dismissLoading();
                    }
                );
        }
    }

    // GetServiceCategory(){
    //   let formdata = {
    //     token:this.user.token
    //   };

    //   this.allServicesService.showLoader();
    //   this.allServicesService.sendData('fetch_cat', formdata).subscribe(data => {
    //     this.allServicesService.dismissLoading();
    //     this.rs = data;
    //     if (this.rs.status = 'ok') {
    //         this.categories=this.rs.categories;
    //     }
    //   }, (err) => {
    //     this.allServicesService.dismissLoading();
    //     if (err.error.error_code == "user_expire") {
    //       this.router.navigate(['/signin']);
    //       this.storage.clear();
    //     }
    //     this.allServicesService.presentAlert(err.error.errormsg);
    //   })
    // }

    Save(order_data) {
        this.storage.set("order_data", order_data).then((data) => {
            let total: number;
            total = this.orderTotal + this.deliveryFees;

            if (total == 0 || total < 0.50) {
                let msg = "Minimum amount for processing a transaction through Stripe in USD is $0.50";
                this.allServicesService.presentAlert(msg);
                return false;
            }
            this.UpdateService(order_data);
        });
    }

    UpdateService(formdata) {
        formdata.token = this.user.token;
        if (this.booking_id > 0) {
            formdata.booking_id = this.booking_id;
        }

        formdata.drop_address = this.location_drop;
        formdata.pickup_address = this.location_pickup;
        this.allServicesService.showLoader();
        this.allServicesService
            .sendData("CreateStripeCaptureBooking/?token=" + this.user.token, formdata)
            .subscribe(
                (data) => {
                    this.allServicesService.dismissLoading();
                    this.rs = data;
                    if ((this.rs.status = "ok")) {
                        this.booking_id = this.rs.booking_id;
                        this.router.navigate(["/driverselect/" + this.rs.booking_id]);
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

    get_payment_type(){
        console.log("role is: " + this.paymentType);
		if (this.paymentType == '0') {
            this.serviceaddform.removeControl('order_total');
            this.serviceaddform.removeControl('order_total');
		} else {
            this.serviceaddform.addControl('order_total', new FormControl('', Validators.compose([Validators.required])));
            this.serviceaddform.addControl('order_total', new FormControl('', Validators.compose([Validators.required])));
		}
    }

}

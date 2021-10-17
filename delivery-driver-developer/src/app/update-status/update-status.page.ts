import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { AllServicesService } from '../all-services.service';
import { Router, NavigationExtras } from '@angular/router';
import { Events, Platform, ToastController, ModalController, NavController, NavParams, MenuController, LoadingController, AlertController } from '@ionic/angular';

import { ActionSheetController } from "@ionic/angular";
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
    selector: 'app-update-status',
    templateUrl: './update-status.page.html',
    styleUrls: ['./update-status.page.scss'],
})
export class UpdateStatusPage implements OnInit {

    updateOrderStatusForm: FormGroup;

    user: any = [];
    action: any;
    order_status: any;
    booking_id: any;

    pickup_order: any;
    enroute_order: any;
    delivered_order: any;

    is_checked_pickup_order: boolean = false;
    is_checked_enroute_order: boolean = false;
    is_checked_delivered_order: boolean = false;

    is_disabled_pickup_order: boolean = false;
    is_disabled_enroute_order: boolean = false;
    is_disabled_delivered_order: boolean = false;
    is_delivered: boolean = false;

    images: any = [];
    type: any;
    drivery_photo_proof_url: any = 'assets/imgs/drop.png';
    drivery_photo_proof_id: any;

    constructor(
        public storage: Storage,
        public allServicesService: AllServicesService,
        public router: Router,
        private navParams: NavParams,
        public loadingCtrl: LoadingController,
        public modalController: ModalController,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public navCtrl: NavController,
        public toastController: ToastController,
        public events: Events,
        private camera: Camera,
        private file: File,
        public transfer: FileTransfer,
        private plt: Platform,
        private loadingController: LoadingController,
        private actionSheetController: ActionSheetController,
        private ref: ChangeDetectorRef,
        private filePath: FilePath

    ) {
        this.action = this.navParams.get('action');
        this.order_status = this.navParams.get('order_status');
        this.booking_id = this.navParams.get('booking_id');
        if(this.navParams.get('drivery_photo_proof_url') !='' && this.navParams.get('drivery_photo_proof_url') != undefined && this.navParams.get('drivery_photo_proof_url') != null){
            this.drivery_photo_proof_url = this.navParams.get('drivery_photo_proof_url');
        }else{
            this.drivery_photo_proof_url = 'assets/imgs/drop.png';
        }
        console.log('drivery_photo_proof_url: '+this.drivery_photo_proof_url);

        this.drivery_photo_proof_id = this.navParams.get('drivery_photo_proof_id');

        if (this.action == 'view_status') {
            this.is_disabled_pickup_order = true;
            this.is_disabled_enroute_order = true;
            this.is_disabled_delivered_order = true;

            if (this.order_status == 1) {
                this.is_checked_pickup_order = false;
                this.is_checked_enroute_order = false;
                this.is_checked_delivered_order = false;
            }else if (this.order_status == 4) {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = false;
                this.is_checked_delivered_order = false;
            } else if (this.order_status == 5) {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = true;
                this.is_checked_delivered_order = false;
            } else {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = true;
                this.is_checked_delivered_order = true;
            }

        }

        if (this.action == 'update_status') {
            if (this.order_status == 1) {
                this.is_checked_pickup_order = false;
                this.is_checked_enroute_order = false;
                this.is_checked_delivered_order = false;

                this.is_disabled_pickup_order = false;
                this.is_disabled_enroute_order = true;
                this.is_disabled_delivered_order = true;
                
            } else if (this.order_status == 4) {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = false;
                this.is_checked_delivered_order = false;

                this.is_disabled_pickup_order = true;
                this.is_disabled_enroute_order = false;
                this.is_disabled_delivered_order = true;
            } else if (this.order_status == 5) {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = true;
                this.is_checked_delivered_order = false;

                this.is_disabled_pickup_order = true;
                this.is_disabled_enroute_order = true;
                this.is_disabled_delivered_order = false;
            } else {
                this.is_checked_pickup_order = true;
                this.is_checked_enroute_order = true;
                this.is_checked_delivered_order = true;

                this.is_disabled_pickup_order = true;
                this.is_disabled_enroute_order = true;
                this.is_disabled_delivered_order = true;
            }
        }

    }

    ngOnInit() {
        this.updateOrderStatusForm = new FormGroup({
            pickup_order: new FormControl(""),
            enroute_order: new FormControl(""),
            delivered_order: new FormControl("")
        });
    }

    ionViewWillEnter() {
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

    async closeModal(action) {
        // if (action == 'ok') {

        // }
        await this.modalController.dismiss({ action: action });
    }

    update_order_status(formValue) {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;

                formValue.token = this.user.token;
                formValue.booking_id = this.booking_id;

                console.log('formValue', JSON.stringify(formValue));

                if(this.order_status==1 && (formValue.pickup_order == '' || formValue.pickup_order==false)){
                    this.allServicesService.presentAlert('Please select order status');
                    return false;
                }
                if(this.order_status==4 && (formValue.enroute_order == '' || formValue.enroute_order==false)){
                    this.allServicesService.presentAlert('Please select order status');
                    return false;
                }
                if(this.order_status==5 && (formValue.delivered_order == '' || formValue.delivered_order==false)){
                    this.allServicesService.presentAlert('Please select order status');
                    return false;
                }
                if(this.order_status==5 && (this.drivery_photo_proof_id == ''|| this.drivery_photo_proof_id == null || this.drivery_photo_proof_id == undefined || this.drivery_photo_proof_id == 0)){
                    this.allServicesService.presentAlert('Please upload photo proof');
                    return false;
                }
                formValue.drivery_photo_proof_id = this.drivery_photo_proof_id;
                
                this.allServicesService.showLoader('Please wait...');
                this.allServicesService.sendData('update_order_status', formValue).subscribe(
                    result => {
                        let rs: any = [];
                        rs = result;
                        console.log("result here", result);
                        if (rs.status == "ok") {
                            this.allServicesService.dismissLoading();
                            if (rs.msg != '') {
                                this.allServicesService.presentToast(rs.msg);
                            }

                            this.events.publish('update_order_status_event', this.user);
                            this.closeModal('ok');
                        }
                    },
                    err => {
                        console.log("Error  == ", err);
                        this.allServicesService.dismissLoading();
                        this.allServicesService.presentAlert(err.error.errormsg);
                    }
                );
            } else {
                this.allServicesService.presentAlert('User token expired, please login again.');
                this.router.navigate(['/signin']);
            }
        }, err => {
            this.router.navigate(['/signin']);
        });

    }

    delivered_on_change(event){
        console.log("delivered_on_change: ", event.detail.checked);
        this.is_delivered = event.detail.checked;
    }


    // IMAGE UPLOAD START
    async selectImage(type) {
        this.images = [];
        this.type = type;
        const actionSheet = await this.actionSheetController.create({
            header: "Select Image source",
            buttons: [{
                text: 'Load image from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Capture image using Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });
        await actionSheet.present();
    }


    takePicture(sourceType: PictureSourceType) {
        var options: CameraOptions = {
            quality: 30,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        this.camera.getPicture(options).then(imagePath => {
            // this.userImage = 'data:image/jpeg;base64,' + imagePath;

            if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        let smext = currentName.split('.').pop();
                        let ext = smext.toLowerCase();
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(ext));
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                let smext = currentName.split('.').pop();
                let ext = smext.toLowerCase();
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(ext));
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
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.updateStoredImages(newFileName);
        }, error => {
            this.allServicesService.presentToast('Error while storing file.');
        });
    }

    updateStoredImages(name) {
        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);

        let newEntry = {
            name: name,
            path: resPath,
            filePath: filePath
        };

        this.images.push(newEntry);
        this.UploadImage(this.user);
        console.log(this.images);
        this.ref.detectChanges(); // trigger change detection cycle
    }


    pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
            return converted;
        }
    }

    UploadImage(user) {
        this.allServicesService.showLoader('Uploading...')
        if (this.images.length > 0) {

            let _mime_type = 'image/jpeg'

            let smext = this.images[0].name.split('.').pop();
            let ext = smext.toLowerCase();

            if (ext == 'png') {
                _mime_type = 'image/png';
            }

            if (ext == 'jpeg') {
                _mime_type = 'image/jpeg';
            }

            if (ext == 'mov') {
                _mime_type = 'video/quicktime';
            }

            if (ext == 'mp4') {
                _mime_type = 'video/mp4';
            }

            if (ext == 'jpg') {
                _mime_type = 'image/jpeg';
            }

            const fileTransfer: FileTransferObject = this.transfer.create();
            let header: Headers = new Headers();
            header.append('Authorization', 'Bearer ' + user.token);
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: user.user_id + '_featured.' + ext,
                chunkedMode: false,
                mimeType: _mime_type,
                params: { 'type': this.type, 'user': user.user_id, 'ext': ext },
                headers: { 'Authorization': 'Bearer ' + user.token }
            }

            let url = this.allServicesService.getURL();
            fileTransfer.upload(this.images[0].filePath, url + '/wp-json/wp/v2/media?token=' + user.token, options)
                .then((data1) => {
                    console.log(data1)
                    this.allServicesService.dismissLoading();
                    this.images = [];

                    let d: any = [];
                    d = JSON.parse(data1.response);

                    console.log("dddddd: " + d);
                    console.log("d.guid.rendered: " + d.guid.rendered);

                    if (this.type == 'drivery_photo_proof') {
                        this.drivery_photo_proof_url = d.guid.rendered;
                        this.drivery_photo_proof_id = d.id;
                    }

                    this.ref.detectChanges(); // trigger change detection cycle

                }, (err) => {
                    console.log(err);
                    this.allServicesService.dismissLoading();
                });
        }
    }
    // IMAGE UPLAD END

}

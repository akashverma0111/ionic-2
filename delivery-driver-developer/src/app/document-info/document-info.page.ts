import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AllServicesService } from "../all-services.service";
import { AlertController, LoadingController, NavController, MenuController, ToastController, Events, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import * as moment from 'moment';

@Component({
    selector: 'app-document-info',
    templateUrl: './document-info.page.html',
    styleUrls: ['./document-info.page.scss'],
})
export class DocumentInfoPage implements OnInit {

    user: any = [];
    vehicle_types: any = [];
    documentInfoForm: FormGroup;
    vehicle_type: any;
    expiration_date: any;

    images: any = [];
    type: any;
    driver_license_url: any = 'assets/imgs/drop.png';
    driver_license_id: any;
    registration_url: any = 'assets/imgs/drop.png';
    registration_id: any;
    insurance_url: any = 'assets/imgs/drop.png';
    insurance_id: any;

    action: any = '';
    buttonText: any = 'Next';

    document_info: any = [];
    ready: boolean;

    datepicker_startdate: any;
    datepicker_enddate: any;

    validation_messages = {
        'driver_license_expiration_date': [
            { type: 'required', message: "Driver's license expiration date is required" },
        ],
        'insurance_expiration_date': [
            { type: 'required', message: 'Insurance expiration date is required' },
        ],
        'registration_expiration_date': [
            { type: 'required', message: 'Registration expiration date is required' },
        ]
    };

    constructor(
        public allServicesService: AllServicesService,
        public loadingCtrl: LoadingController,
        public router: Router,
        private route: ActivatedRoute,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public toastController: ToastController,
        public storage: Storage,
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

        this.datepicker_startdate = moment().format('YYYY-MM-DD');
        this.datepicker_enddate = moment().add(50, 'years').format('YYYY-MM-DD');

        console.log('this.datepicker_startdate: ', this.datepicker_startdate);

        this.route.queryParams.subscribe(params => {
            let queryData: any = []
            queryData = params;
            if (queryData.action) {
                this.action = queryData.action;
                this.buttonText = 'Update';
            }
        });

        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                this.allServicesService.SaveAutoConfiqure(this.user.token);

                if (this.action == 'update') {
                    this.get_document_information();
                } else {
                    this.ready = true;
                }
            }
        }, err => {

        });

    }

    ngOnInit() {
        this.documentInfoForm = new FormGroup({
            driver_license_expiration_date: new FormControl("", Validators.compose([Validators.required])),
            insurance_expiration_date: new FormControl("", Validators.compose([Validators.required])),
            registration_expiration_date: new FormControl("", Validators.compose([Validators.required]))
        });
    }

    get_document_information() {
        this.ready = false;
        this.allServicesService.getData('get_document_information/?token=' + this.user.token).subscribe((result) => {
            this.ready = true;
            let res: any = [];
            res = result;
            this.document_info = res.document_info;
            console.log('this.document_info: ', this.document_info);

            if (this.document_info.driver_license_id) {
                this.driver_license_id = this.document_info.driver_license_id;
                this.driver_license_url = this.document_info.driver_license_url;
            }
            if (this.document_info.insurance_id) {
                this.insurance_id = this.document_info.insurance_id;
                this.insurance_url = this.document_info.insurance_url;
            }
            if (this.document_info.registration_id) {
                this.registration_id = this.document_info.registration_id;
                this.registration_url = this.document_info.registration_url;
            }

            this.documentInfoForm.controls['driver_license_expiration_date'].setValue(this.document_info.driver_license_expiration_date);
            this.documentInfoForm.controls['insurance_expiration_date'].setValue(this.document_info.insurance_expiration_date);
            this.documentInfoForm.controls['registration_expiration_date'].setValue(this.document_info.registration_expiration_date);

            this.ref.detectChanges();

        }, (err) => {
            this.ready = true;
            console.log("error...", err);
        });
    }

    saveDocumentInfo(formValue) {
        this.storage.get('user').then(userInfo => {
            if (userInfo != null) {
                this.user = userInfo;
                // if(this.vehicleInfoForm.get('preferred_date_1').hasError(this.validation_messages.vehicleInfoForm[0].type) && this.vehicleInfoForm.get('preferred_date_2').hasError(this.validation_messages.preferred_date_2[0].type) && this.registerForm.get('preferred_date_3').hasError(this.validation_messages.preferred_date_3[0].type)) {
                //   this.allServicesService.presentAlert('Please select atleast one date!');
                //   return false;
                // }

                // formValue.signup_step = '5';
                formValue.token = this.user.token;

                formValue.driver_license_id = this.driver_license_id;
                formValue.insurance_id = this.insurance_id;
                formValue.registration_id = this.registration_id;
                if (this.action == 'update') {
                    formValue.action = 'update';
                } else {
                    formValue.action = 'add';
                }
                this.allServicesService.showLoader('Please wait...');
                this.allServicesService.sendData('save_document_info', formValue).subscribe(
                    result => {
                        let rs: any = [];
                        rs = result;
                        console.log("result here", result);
                        if (rs.status == "ok") {
                            // this.oneSignal.getIds().then((data) => {
                            // 	console.log(data);
                            // 	this.deviceToken = data.userId;
                            // });
                            this.allServicesService.dismissLoading();

                            if (rs.msg != '') {
                                this.allServicesService.presentToast(rs.msg);
                            }

                            this.events.publish('user:save_document_info', this.user);

                            if (this.action == 'update') {
                                this.router.navigate(['/document-information']);
                            } else {
                                this.user.completed_step = 'document_info';
                                this.storage.set('user_profile', this.user);
                                this.storage.set('user', this.user);
                                this.router.navigate(['/background-check-edit']);
                            }
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

                    if (this.type == 'driver_license') {
                        this.driver_license_url = d.guid.rendered;
                        this.driver_license_id = d.id;
                    }

                    if (this.type == 'insurance') {
                        this.insurance_url = d.guid.rendered;
                        this.insurance_id = d.id;
                    }

                    if (this.type == 'registration') {
                        this.registration_url = d.guid.rendered;
                        this.registration_id = d.id;
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

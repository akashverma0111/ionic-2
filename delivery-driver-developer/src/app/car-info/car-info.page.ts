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

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
})
export class CarInfoPage implements OnInit {

    user: any = [];
    vehicle_types: any = [];
    vehicleInfoForm: FormGroup;
    vehicle_type: any;
    expiration_date: any;

    images: any = [];
    type: any;
    vehicle_image_url: any = 'assets/imgs/drop.png';
    vehicle_image_id: any;
    vehicle_registration_image_url: any = 'assets/imgs/drop.png';
    vehicle_registration_image_id: any;

    vehicle_info: any = [];
    ready: boolean;

    action: any = '';
    buttonText: any = 'Next';

    validation_messages = {
        'vehicle_name': [
            { type: 'required', message: 'Vehicle name is required' },
        ],
        'vehicle_type': [
            { type: 'required', message: 'Vehicle type is required' },
        ],
        'make': [
            { type: 'required', message: 'Vehicle make is required' },
        ],
        'model': [
            { type: 'required', message: 'Vehicle model is required' },
        ],
        'color': [
            { type: 'required', message: 'Vehicle color is required' },
        ],
        'vin': [
            { type: 'required', message: 'Vehicle VIN is required' },
        ],
        'registration_number': [
            { type: 'required', message: 'Registration number is required' },
        ],
        'vehicle_classes': [
            { type: 'required', message: 'Vehicle classes is required' },
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

    this.storage.get('user').then(userInfo => {
        if (userInfo != null) {
            this.user = userInfo;
            if (this.action == 'update') {
                this.get_vehicle_information();
            }
        }
    }, err => {

    });

    this.route.queryParams.subscribe(params => {
        let queryData: any = []
        queryData = params;
        if (queryData.action) {
            this.action = queryData.action;
            this.buttonText = 'Update';
        }
    });

    this.get_vehicle_types();
  }

  ngOnInit() {
    this.vehicleInfoForm = new FormGroup({
        vehicle_name: new FormControl("", Validators.compose([Validators.required])),
        vehicle_type: new FormControl("", Validators.compose([Validators.required])),
        make: new FormControl("", Validators.compose([Validators.required])),
        model: new FormControl("", Validators.compose([Validators.required])),
        color: new FormControl("", Validators.compose([Validators.required])),
        vin: new FormControl("", Validators.compose([Validators.required])),
        registration_number: new FormControl("", Validators.compose([Validators.required])),
        vehicle_classes: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  get_vehicle_types() {
    this.allServicesService.getData('get_vehicle_types').subscribe((result) => {
        let res: any = [];
        res = result;
        this.vehicle_types = res.vehicle_types;
        console.log('this.vehicle_types: ', this.vehicle_types);
        // this.addNewDateForm.controls['category'].setValue(this.user.vehicle_name);
    }, (err) => {
        console.log("error...", err);
    });
}

get_vehicle_information() {
    this.ready = false;
    this.allServicesService.getData('get_vehicle_information/?token=' + this.user.token).subscribe((result) => {
        this.ready = true;
        let res: any = [];
        res = result;
        this.vehicle_info = res.vehicle_info;
        console.log('this.vehicle_info: ', this.vehicle_info);

        if(this.vehicle_info.vehicle_image_id){
            this.vehicle_image_url = this.vehicle_info.vehicle_image_url;
            this.vehicle_image_id = this.vehicle_info.vehicle_image_id;
        }

        this.vehicle_registration_image_url = this.vehicle_info.vehicle_registration_image_url;
        this.vehicle_registration_image_id = this.vehicle_info.vehicle_registration_image_id;

        this.vehicleInfoForm.controls['vehicle_name'].setValue(this.vehicle_info.vehicle_name);
        this.vehicleInfoForm.controls['vehicle_type'].setValue(this.vehicle_info.vehicle_type);
        this.vehicleInfoForm.controls['make'].setValue(this.vehicle_info.make);
        this.vehicleInfoForm.controls['model'].setValue(this.vehicle_info.model);
        this.vehicleInfoForm.controls['color'].setValue(this.vehicle_info.color);
        this.vehicleInfoForm.controls['vin'].setValue(this.vehicle_info.vin);
        this.vehicleInfoForm.controls['registration_number'].setValue(this.vehicle_info.registration_number);
        this.vehicleInfoForm.controls['vehicle_classes'].setValue(this.vehicle_info.vehicle_classes);
        this.ref.detectChanges();

    }, (err) => {
        this.ready = true;
        console.log("error...", err);
    });
}

saveVehicleInfo(formValue) {
    this.storage.get('user').then(userInfo => {
        if (userInfo != null) {
            this.user = userInfo;
            // if(this.vehicleInfoForm.get('preferred_date_1').hasError(this.validation_messages.vehicleInfoForm[0].type) && this.vehicleInfoForm.get('preferred_date_2').hasError(this.validation_messages.preferred_date_2[0].type) && this.registerForm.get('preferred_date_3').hasError(this.validation_messages.preferred_date_3[0].type)) {
            //   this.allServicesService.presentAlert('Please select atleast one date!');
            //   return false;
            // }

            // formValue.signup_step = '5';
            formValue.token = this.user.token;
            formValue.vehicle_image_id = this.vehicle_image_id;
            formValue.vehicle_registration_image_id = this.vehicle_registration_image_id;
            if(this.action == 'update'){
                formValue.action = 'update';
            }else{
                formValue.action = 'add';
            }

            this.allServicesService.showLoader('Please wait...');
            this.allServicesService.sendData('save_vehicle_info', formValue).subscribe(
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

                        this.events.publish('user:save_vehicle_info', this.user);

                        if (this.action == 'update') {
                            this.router.navigate(['/vehicle-information']);
                        } else {
                            this.user.completed_step = 'vehicle_info';
                            this.storage.set('user_profile', this.user);
                            this.storage.set('user', this.user);
                            this.router.navigate(['/document-info']);
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

                console.log("dddddd: "+d);
                console.log("d.guid.rendered: "+d.guid.rendered);

                if (this.type == 'vehicle_image') {
                    this.vehicle_image_url = d.guid.rendered;
                    this.vehicle_image_id = d.id;
                }

                // if (this.type == 'vehicle_registration') {
                //     this.vehicle_registration_image_url = d.guid.rendered;
                //     this.vehicle_registration_image_id = d.id;
                // }
                this.ref.detectChanges(); // trigger change detection cycle

            }, (err) => {
                console.log(err);
                this.allServicesService.dismissLoading();
            });
    }
}
// IMAGE UPLAD END

}

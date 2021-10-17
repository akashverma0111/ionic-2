import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, ModalController, Events,ToastController, Platform,ActionSheetController  } from '@ionic/angular';
import { Storage } from '@ionic/storage'; 

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-myservicesadd',
  templateUrl: './myservicesadd.page.html',
  styleUrls: ['./myservicesadd.page.scss'],
})
export class MyservicesaddPage implements OnInit {
  user:any;
  serviceaddform: FormGroup;
  rs:any=[];
  post_id:any;
  post:any=[];
  price:any=[];
  
  form_valid:boolean=false;

  imageURI: any;
  images: any = [];
  res_image: any;
  categories:any=[];
  type:any="service_image";
  post_type:any;
  image_data:any="https://trubarber.betaplanets.com/wp-content/uploads/2020/03/placeholder.jpg";
  constructor(
    private modalController: ModalController,
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public alertCtrl: AlertController,
    public storage: Storage,
    private route: ActivatedRoute,
    public events:Events,
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
    

  }
 
  ngOnInit() {
    this.image_data="https://trubarber.betaplanets.com/wp-content/uploads/2020/03/placeholder.jpg";
    console.log(this.post_id);
    this.post_type = this.route.snapshot.parent.paramMap.get('post_type');
    this.post_id = this.route.snapshot.parent.paramMap.get('post_id');
    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        if(this.post_id){
          this.GetCustomService(this.post_id);

        }else{
          this.post_id=0;
        }

        this.GetServiceCategory();
       
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.router.navigate(['/signin']);
    });



    this.serviceaddform = new FormGroup({
      'name': new FormControl('', Validators.compose([
        Validators.required,
      ])),
      'category': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'address1': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'address2': new FormControl(''),
      'city': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'state': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'zip': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'del_address1': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'del_address2': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'del_city': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'del_state': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'del_zip': new FormControl('', Validators.compose([
        Validators.required
      ])),
    });

    
  }
 
  async closeModal(close:any='') {
    const onClosedData: string =close;
    await this.modalController.dismiss(onClosedData);
    
  }


  GetCustomService(post_id){
    let formdata ={
      post_id:post_id
    }
    
    this.allServicesService.showLoader();
    this.allServicesService.sendData('GetCustomService/?token=' + this.user.token, formdata).subscribe(data => {
      this.allServicesService.dismissLoading();
      this.rs = data;

      if (this.rs.status = 'ok') {
        if(!this.rs.post){
           this.closeModal();
        }else{
           this.post=this.rs.post;
           this.price=this.rs.post_price;
           this.serviceaddform.controls['service_name'].setValue(this.post.post_title);
           this.serviceaddform.controls['service_price'].setValue(this.price.price);
           this.serviceaddform.controls['service_time'].setValue(this.price.time);
           this.image_data=this.rs.image;

        }
        //this.allServicesService.presentAlert(this.rs.msg);
      }
    }, (err) => {
      this.allServicesService.dismissLoading();
      if (err.error.error_code == "user_expire") {
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }


 


  async selectImage(type) {
    this.type=type;
    this.images = [];
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load image from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'capture image using Camera',
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
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
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
      this.presentToast('Error while storing file.');
    });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
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
   this.image_data=resPath;
    console.log(this.images);
    this.ref.detectChanges(); // trigger change detection cycle
  }

  getImgContent() {
    return this.sanitizer.bypassSecurityTrustUrl(this.image_data);
}


  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
      return converted;
    }
  }



  UploadImage(post_id,msg) {
    this.allServicesService.showLoader('uploading...')
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
      header.append('Authorization', 'Bearer ' + this.user.token);
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: post_id + '_featured.' + ext,
        chunkedMode: false,
        mimeType: _mime_type,
        params: { 'type': this.type, 'user': this.user.user_id,'post_id':post_id, 'ext': ext },
        headers: { 'Authorization': 'Bearer ' + this.user.token }
      }


      let url = this.allServicesService.getURL();
      fileTransfer.upload(this.images[0].filePath, url + '/wp-json/wp/v2/media?token=' + this.user.token, options)
        .then((data1) => {
          console.log(data1)
          this.events.publish('reloadservices',1);
          this.allServicesService.presentAlert(msg);
          this.allServicesService.dismissLoading();
        }, (err) => {
          console.log(err);
          this.allServicesService.dismissLoading();
        });
    }
  }


  GetServiceCategory(){
    let formdata = {
      token:this.user.token
    };
   
    this.allServicesService.showLoader();
    this.allServicesService.sendData('fetch_cat', formdata).subscribe(data => {
      this.allServicesService.dismissLoading();
      this.rs = data;
      if (this.rs.status = 'ok') {
          this.categories=this.rs.categories;
      }
    }, (err) => {
      this.allServicesService.dismissLoading();
      if (err.error.error_code == "user_expire") {
        this.router.navigate(['/signin']);
        this.storage.clear();
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }

  UpdateService(formdata){
    formdata.token=this.user.token;
    if(this.post){
      formdata.post_id=this.post_id;
    }
    formdata.post_type="delivery";
    this.allServicesService.showLoader();
    this.allServicesService.sendData('CreateMyCustomService/?token=' + this.user.token, formdata).subscribe(data => {
      this.allServicesService.dismissLoading();
      this.rs = data;
      if (this.rs.status = 'ok') {
        if(this.images.length > 0){
          this.UploadImage(this.rs.post,this.rs.msg);
        }else{
          this.events.publish('reloadservices',1);
          this.allServicesService.presentAlert(this.rs.msg);
          //this.closeModal('reload');
        }
       
         
      }
    }, (err) => {
      this.allServicesService.dismissLoading();
      if (err.error.error_code == "user_expire") {
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }
}
 



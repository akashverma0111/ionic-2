import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormArray , FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { AlertController, LoadingController, NavController,ModalController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MyservicesaddPage } from '../myservicesadd/myservicesadd.page';



@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  user: any;
  posts = [];
  page = 1;
  count = null;
  likecount:any;
  result:any;
  readyposts:boolean=false;
  category:any;
  res:any=[];
  ready:boolean=false;
  list:any=[];
  constructor(
    public allServicesService: AllServicesService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage,
    private _formBuilder: FormBuilder,
    public modalController: ModalController,
    public events:Events
  ) {

   }

  ngOnInit() {
    this.category = 'posted';
    this.events.subscribe('reloadservices', (val) => {
      this.storage.get('user').then(userInfo => {
        if (userInfo != null) {
          this.user = userInfo;
          this.loadPosts();
          this.GetServices();
        } else {
          this.router.navigate(['/signin']);
        }
      }, err => {
        this.router.navigate(['/signin']);
      });
    });
    this.storage.get('user').then(userInfo => {
      if (userInfo != null) {
        this.user = userInfo;
        this.loadPosts();
        this.GetServices();
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.router.navigate(['/signin']);
    });
  }


  async loadPosts() {
   
    this.page=1;
    this.allServicesService.getServicePosts(this.page,this.user.token,1).subscribe(res => {
      this.count = this.allServicesService.totalPosts;
      this.posts = res;
      this.readyposts=true;
    });
  }
 
  loadMore(event) {
    this.page++;
 
    this.allServicesService.getServicePosts(this.page,this.user.token,1).subscribe(res => {
      this.posts = [...this.posts, ...res];
      event.target.complete();
 
      // Disable infinite loading when maximum reached
      if (this.page == this.allServicesService.pages) {
        event.target.disabled = true;
      }
    },(err) => {
      console.log(err);
      event.target.complete();
    });
  }



  GetServices(){
      this.allServicesService.getData('getUserServices/?token=' + this.user.token).subscribe(data => {
      this.res = data;
      if (this.res.status = 'ok') {
        this.ready = true;
        this.list = this.res.list;
      }
    }, (err) => {
      this.ready = true;
      if (err.error.error_code == "user_expire") {
        
        this.allServicesService.presentAlert(err.error.errormsg);
        this.router.navigate(['/signin']);
      }
      this.allServicesService.presentAlert(err.error.errormsg);
    })
  }
}



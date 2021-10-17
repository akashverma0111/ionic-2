import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-singlefeed',
    templateUrl: './singlefeed.page.html',
    styleUrls: ['./singlefeed.page.scss'],
})
export class SinglefeedPage implements OnInit {
    post: any;
    user: any;
    result: any;
    likecount: any;
    readyposts: boolean = false;

    constructor(
        public modalController: ModalController,
        private route: ActivatedRoute,
        public serviceForAllService: AllServicesService,
        public loadingCtrl: LoadingController,
        public storage: Storage,
        public alertCtrl: AlertController,
        private router: Router
    ) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.GetPostContent();
        this.storage.get('user').then((user) => {
            console.log(" USER LOGIN " + JSON.stringify(user));
            if (user) {
                this.user = user;
                this.serviceForAllService.SaveAutoConfiqure(this.user.token);
            }
        });
    }

    GetPostContent() {
        let id = this.route.snapshot.paramMap.get('id');
        this.serviceForAllService.getPostContent(id).subscribe(res => {
            this.post = res;
            this.readyposts = true;
        });
    }

    openOriginal() {
        // Add InAppBrowser for app if want
        window.open(this.post.link, '_blank');
    }

    async presentAlert(msg) {
        let alert = await this.alertCtrl.create({
            header: 'Alert',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

}


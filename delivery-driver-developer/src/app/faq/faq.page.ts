import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AllServicesService } from '../all-services.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

    posts = [];
    page = 1;
    count = null;
    user: any;
    likecount: any;
    result: any;
    readyposts: boolean = false;

    constructor(
        private router: Router,
        public alertCtrl: AlertController,
        public storage: Storage,
        public serviceForAllService: AllServicesService,
        public loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.storage.get('user').then((user) => {
            console.log(" USER LOGIN " + JSON.stringify(user));
            if (user) {
                this.user = user;
                this.loadPosts(this.user.token);
            }
        });
    }

    async loadPosts(user) {

        this.page = 1;
        this.serviceForAllService.getFAQs(this.page, this.user.token).subscribe(res => {
            this.count = this.serviceForAllService.totalPosts;
            this.posts = res;
            this.readyposts = true;
        });
    }

    loadMore(event) {
        this.page++;

        this.serviceForAllService.getFAQs(this.page, this.user.token).subscribe(res => {
            this.posts = [...this.posts, ...res];
            event.target.complete();

            // Disable infinite loading when maximum reached
            if (this.page == this.serviceForAllService.pages) {
                event.target.disabled = true;
            }
        }, (err) => {
            console.log(err);
            event.target.complete();
        });
    }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-delivery-history',
    templateUrl: './delivery-history.page.html',
    styleUrls: ['./delivery-history.page.scss'],
})
export class DeliveryHistoryPage implements OnInit {

    isActiveToday: any = '';
    isActiveLastWeek: any = '';
    isActiveLastMonth: any = '';
    isActiveLastYear: any = '';
    isActiveAll: any = '';

    constructor(
        private router: Router
    ) {

    }

    ngOnInit() {
    }

    view_delivery_history(time_duration) {

        if (time_duration == 'today') {
            this.isActiveToday = 'active';
            this.isActiveLastWeek = '';
            this.isActiveLastMonth = '';
            this.isActiveLastYear = '';
            this.isActiveAll = '';
        }
        if (time_duration == 'last_week') {
            this.isActiveLastWeek = 'active';
            this.isActiveToday = '';
            this.isActiveLastMonth = '';
            this.isActiveLastYear = '';
            this.isActiveAll = '';
        }
        if (time_duration == 'last_month') {
            this.isActiveLastMonth = 'active';
            this.isActiveToday = '';
            this.isActiveLastWeek = '';
            this.isActiveLastYear = '';
            this.isActiveAll = '';
        }
        if (time_duration == 'last_year') {
            this.isActiveLastYear = 'active';
            this.isActiveToday = '';
            this.isActiveLastWeek = '';
            this.isActiveLastMonth = '';
            this.isActiveAll = '';
        }
        if (time_duration == 'all') {
            this.isActiveAll = 'active';
            this.isActiveToday = '';
            this.isActiveLastWeek = '';
            this.isActiveLastMonth = '';
            this.isActiveLastYear = '';
        }

        let queryData: any = [];
        queryData['duration'] = time_duration;
        let navigationExtras: NavigationExtras = {
            queryParams: queryData
        };
        this.router.navigate(['delivery-history2'], navigationExtras);

    }

}

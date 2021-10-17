import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        public router: Router
    ) { }

    ngOnInit() {
    }

    goto_singup_page(role) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                role: role
            }
        };
        this.router.navigate(['/signup'], navigationExtras);
    }
}

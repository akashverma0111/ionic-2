import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {
  msg:any;
  page_title:any;
  constructor(private route: ActivatedRoute) { 
  this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
     this.msg = params['msg'];
     this.page_title=params['page_title']
      });
   
  }

  ngOnInit() {
  }

}

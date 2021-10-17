import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'shop',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../searchfilter/searchfilter.module').then(m => m.SearchfilterPageModule)
            
          }
        ]
      },
      {
        path: 'home-user',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home-user/home-user.module').then(m => m.HomeUserPageModule)
            
          }
        ]
      },
      // {
      //   path: 'appointments',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../appointments/appointments.module').then(m => m.AppointmentsPageModule)
      //     }
      //   ]
      // },
      {
        path: 'booking',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../booking/booking.module').then(m => m.BookingPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule)
          }
        ]
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../messages/messages.module').then(m => m.MessagesPageModule)
          }
        ]
      },
     
      {
        path: '',
        redirectTo: '/tabs/shop',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/shop',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

// app.routes.ts

import { Routes } from '@angular/router';
import { LoginPageComponent } from './hotels/components/login-page/login-page.component';
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';
import { HotelResultsComponent } from './hotels/components/hotel-results/hotel-results.component';
import { HotelDetailsComponent } from './hotels/components/hotel-details/hotel-details.component';
import { HotelBookingComponent } from './hotels/components/hotel-booking/hotel-booking.component';
import { MyBookingsComponent } from './hotels/components/my-bookings/my-bookings.component';
import { AdminHotelsComponent } from './hotels/components/admin-hotels/admin-hotels.component';
import { AdminDashboardComponent } from './hotels/components/admin-dashboard/admin-dashboard.component';
import { AdminBookingsComponent } from './hotels/components/admin-bookings/admin-bookings.component';
import { ServiceProviderHotelComponent } from './hotels/components/service-provider-hotel/service-provider-hotel.component';
import { ServiceProviderDashboardComponent } from './hotels/components/service-provider-dashboard/service-provider-dashboard.component';


export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  {
    path: 'hotels',
    children: [
      { path: 'search', component: SearchHotelComponent },
      { path: 'search-results', component: HotelResultsComponent },
      { path: 'hotel-details/:id', component: HotelDetailsComponent },
      { path: 'hotel-booking', component: HotelBookingComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'admin',
        children: [
          { path: 'hotels', component: AdminHotelsComponent },
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'bookings', component: AdminBookingsComponent },
        ]
      },
      { path: 'service-provider',
        children: [
          { path: 'hotels', component: ServiceProviderHotelComponent },
          { path: 'dashboard', component: ServiceProviderDashboardComponent },
        ]
      },
    ],
  },
];



// app.routes.ts

import { Routes } from '@angular/router';
import { LoginPageComponent } from './hotels/components/login-page/login-page.component';
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';
import { HotelResultsComponent } from './hotels/components/hotel-results/hotel-results.component';
import { HotelDetailsComponent } from './hotels/components/hotel-details/hotel-details.component';
import { HotelBookingComponent } from './hotels/components/hotel-booking/hotel-booking.component';
import { MyBookingsComponent } from './hotels/components/my-bookings/my-bookings.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'hotels', component: SearchHotelComponent },
  { path: 'hotels/search-results', component: HotelResultsComponent },
  { path: 'hotels/hotel-details/:id', component: HotelDetailsComponent },
  { path: 'hotels/hotel-booking', component: HotelBookingComponent },
  { path: 'hotels/my-bookings', component: MyBookingsComponent }
];



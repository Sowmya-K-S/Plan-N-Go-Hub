// app.routes.ts

import { Routes } from '@angular/router';
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';
import { HotelResultsComponent } from './hotels/components/hotel-results/hotel-results.component';
import { HotelDetailsComponent } from './hotels/components/hotel-details/hotel-details.component';
import { HotelBookingComponent } from './hotels/components/hotel-booking/hotel-booking.component';
import { MyBookingsComponent } from './hotels/components/my-bookings/my-bookings.component';

export const routes: Routes = [
  { path: '', component: SearchHotelComponent },
  { path: 'search-results', component: HotelResultsComponent },
  { path: 'hotel-details/:id', component: HotelDetailsComponent },
  { path: 'hotel-booking', component: HotelBookingComponent },
  { path: 'my-bookings', component: MyBookingsComponent }
];



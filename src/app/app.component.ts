//app.component.ts

import { Component } from '@angular/core';
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchHotelComponent,RouterModule],  // Import the standalone SearchHotelComponent here
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

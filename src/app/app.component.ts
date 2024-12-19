import { Component } from '@angular/core';
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchHotelComponent],  // Import the standalone SearchHotelComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

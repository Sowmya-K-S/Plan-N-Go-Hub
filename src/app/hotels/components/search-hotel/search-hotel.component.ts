import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Ensure this is imported for HttpClient

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [HttpClientModule, CommonModule],  // Properly import HttpClientModule and CommonModule
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css']
})
export class SearchHotelComponent implements OnInit {
  hotels: any[] = [];  // Holds the fetched hotel data

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels() {
    this.http.get<any[]>('http://localhost:3000/hotels').subscribe(
      (data) => {
        this.hotels = data;
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
      }
    );
  }


  
}

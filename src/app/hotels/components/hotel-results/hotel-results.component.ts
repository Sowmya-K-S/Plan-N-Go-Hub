
// hotel-results.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-results.component.html',
  styleUrls: ['./hotel-results.component.css']
})
export class HotelResultsComponent implements OnInit {
  hotels: any[] = [];
  searchParams: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = params;
      this.fetchFilteredHotels(params['location']);
    });
  }

  fetchFilteredHotels(location: string) {
    // Make sure the location exists before proceeding
    if (location) {
      const apiUrl = `http://localhost:3000/hotels?location_like=${location}`;

      this.http.get<any[]>(apiUrl).subscribe(
        (data) => {
          // Filter the data based on location
          const filteredHotels = data.filter(hotel =>
            hotel.location.toLowerCase().includes(location.toLowerCase())
          );
          
          if (filteredHotels.length === 0) {
            this.hotels = []; // No hotels found
          } else {
            this.hotels = filteredHotels; // Assign the filtered hotels
          }
        },
        (error) => {
          console.error('Error fetching filtered hotel data:', error);
          this.hotels = [];
        }
      );
    } else {
      this.hotels = []; // No location, so no results
    }
  }
}

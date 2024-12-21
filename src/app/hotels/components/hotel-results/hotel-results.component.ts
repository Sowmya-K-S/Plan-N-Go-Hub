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
  filteredHotels: any[] = [];
  searchParams: any;

  filters = {
    price: 0,
    minPrice: 0, // Added minPrice
    amenities: [] as string[]
  };

  availableAmenities = [
    'Free WiFi',
    'Air Conditioning',
    'Parking',
    'Sea View',
    'Spa',
    'Fitness Center',
    'Restaurant',
    'Bar',
    'Garden View',
    'Pool',
    'Mountain View',
    'Yoga Retreat',
    'City View',
    'Beachfront',
    'Palace View',
    'Gym',
    'Lake View',
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = params;
      this.fetchFilteredHotels(params['location']);
    });
  }

  fetchFilteredHotels(location: string) {
    if (location) {
      const apiUrl = `http://localhost:3000/hotels?location_like=${location}`;
      this.http.get<any[]>(apiUrl).subscribe(
        (data) => {
          this.hotels = data.filter(hotel =>
            hotel.location.toLowerCase().includes(location.toLowerCase())
          );
          this.filteredHotels = [...this.hotels]; // Initialize filteredHotels
        },
        (error) => {
          console.error('Error fetching filtered hotel data:', error);
          this.hotels = [];
          this.filteredHotels = [];
        }
      );
    } else {
      this.hotels = [];
      this.filteredHotels = [];
    }
  }

  onAmenityChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const amenity = checkbox.value;

    if (checkbox.checked) {
      this.filters.amenities.push(amenity);
    } else {
      this.filters.amenities = this.filters.amenities.filter(a => a !== amenity);
    }
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter((hotel) => {
      // Filter by price
      const matchesMaxPrice = this.filters.price
        ? hotel.price <= this.filters.price
        : true;
      const matchesMinPrice = this.filters.minPrice
        ? hotel.price >= this.filters.minPrice
        : true;

      // Filter by amenities
      const matchesAmenities = this.filters.amenities.length
        ? this.filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
        : true;

      return matchesMaxPrice && matchesMinPrice && matchesAmenities;
    });
  }
}

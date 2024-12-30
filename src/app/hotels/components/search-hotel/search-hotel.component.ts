//search-hotel.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css'],
})
export class SearchHotelComponent implements OnInit {
  hotels: Hotel[] = [];
  topDeals: Hotel[] = [];
  searchParams = {
    location: '',
    startDate: '',
    endDate: '',
    rooms: 1,
    adults: 1,
    children: 0,
  };

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels() {
    this.hotelService.getHotels().subscribe(
      (data) => {
        this.hotels = data;
        this.topDeals = this.hotels.filter((hotel) => hotel.price < 12000);
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
      }
    );
  }

  showWarning: boolean = false;
  onSearch() {
    const { location } = this.searchParams;
    if (!location.trim()) {
      return; // Prevent empty location searches
    }
    this.router.navigate(['/search-results'], { queryParams: { location: location.trim() } });
  }
  

  navigateToDetails(hotel: Hotel): void {
    this.hotelService.setSelectedHotel(hotel);
    this.router.navigate(['/hotel-details', hotel.id]);
  }


  navigateToLocation(location: string): void {
    if (!location.trim()) {
      console.error('Invalid location');
      return;
    }
    this.router.navigate(['/search-results'], { queryParams: { location: location.trim() } });
  }
  
}

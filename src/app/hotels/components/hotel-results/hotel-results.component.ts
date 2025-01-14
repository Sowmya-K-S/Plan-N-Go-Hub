//hotel-results.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFilter, faStar, faMapMarkerAlt} from'@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './hotel-results.component.html',
  styleUrls: ['./hotel-results.component.css'],
})
export class HotelResultsComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  searchParams: any;

  faFilter = faFilter;
  faStar = faStar;
  faMapMarkerAlt = faMapMarkerAlt
  

  filters = {
    price: 0,
    minPrice: 0,
    amenities: [] as string[],
  };

  availableAmenities = [
    'Outdoor swimming pool','Spa','Gym','Bar','Massage room','Restaurant','Children pool','Free Wifi','Karaoke','Playground','Free Parking','Lift','Sauna','Childcare service','Luggage storage','Conference room','EV charging station','Cleaning Services','Table tennis room','Yoga Retreat'];


  constructor(private route: ActivatedRoute, private hotelService: HotelService, private router: Router) {}

  location: string = "";

  ngOnInit() {
    
    this.hotelService.getSearchDetails().subscribe((details) => {
      if (details) {
        this.searchParams = details;
        this.fetchHotels(details['location']); 
      }
 
  });
    
  }
  
  fetchHotels(location?: string) {
    if (!location?.trim()) {
      this.hotels = [];
      this.filteredHotels = [];
      return; // No location provided, don't fetch hotels
    }
    this.hotelService.getHotelsByLocation(location).subscribe(
      (data) => {
        this.hotels = data;
        this.filteredHotels = [...this.hotels]; // Keep the original list for filtering
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
        this.hotels = [];
        this.filteredHotels = [];
      }
    );
  }
  
  
  applyFilters() {
    // Apply both price and amenities filtering
    this.filteredHotels = this.hotelService.filterHotels(this.hotels, this.filters);
  }
  
  onAmenityChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const amenity = checkbox.value;
  
    if (checkbox.checked) {
      this.filters.amenities.push(amenity);
    } else {
      this.filters.amenities = this.filters.amenities.filter((a) => a !== amenity);
    }
    // Do not call applyFilters() here to avoid auto-filtering
  }


    //to fill stars
    getFilledStars(rating: number): number[] {
    return Array(rating).fill(0); // Generate an array of the rating size
  }

    //for rating label
    getRatingLabel(rating: number): string {
      if (rating >= 4.2) {
        return 'Excellent';
      } else if (rating >= 3.5) {
        return 'Very Good';
      } else if (rating >= 3) {
        return 'Good';
      } else {
        return '';
      }
    }

    //truncation of amenities
    getTruncatedAmenities(place: string): string {
      const maxLength = 70; // Maximum length for the name
      if (place.length > maxLength) {
        const [name, distance] = place.match(/^(.*)\s\(([^)]+)\)$/)?.slice(1) || [place, ''];
        return name.substring(0, maxLength) + '... ' + (distance ? `(${distance})` : '');
      }
      return place;
    }
  
  navigateToDetails(hotel: Hotel): void {
    this.hotelService.setSelectedHotel(hotel);
    this.router.navigate(['/hotel-details', hotel.id]);
  }


}
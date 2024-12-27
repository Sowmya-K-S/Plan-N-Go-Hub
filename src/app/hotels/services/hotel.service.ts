
//hotel.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/hotels';

  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  /**
   * Fetch hotels filtered by location
   * @param location Location to filter hotels
   * @returns Observable<Hotel[]>
   */
  getHotelsByLocation(location?: string): Observable<Hotel[]> {
    const trimmedLocation = location?.trim();
    const url = trimmedLocation
      ? `${this.apiUrl}?location=${encodeURIComponent(trimmedLocation)}`
      : this.apiUrl;
  
    console.log('API URL:', url); // Debugging the API endpoint
    return this.http.get<Hotel[]>(url);
  }
  
  

  /**
   * Filter hotels based on price and amenities
   * @param hotels The list of hotels to filter
   * @param filters Object containing filter criteria
   * @returns Filtered list of hotels
   */

  filterHotels(hotels: Hotel[], filters: { price: number; minPrice: number; amenities: string[] }): Hotel[] {
    return hotels.filter((hotel) => {
      const matchesMaxPrice = filters.price ? hotel.price <= filters.price : true;
      const matchesMinPrice = filters.minPrice ? hotel.price >= filters.minPrice : true;
      const matchesAmenities = filters.amenities.length
        ? filters.amenities.every((amenity) => hotel['amenities'].includes(amenity))
        : true;

      return matchesMaxPrice && matchesMinPrice && matchesAmenities;
    });
  }
}

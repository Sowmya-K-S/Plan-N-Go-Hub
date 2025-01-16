
//hotel.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})

export class HotelService {
  private apiUrl = 'http://localhost:3000/hotels';

constructor(private http: HttpClient) {}
 // BehaviorSubject to store search details
 private searchDetailsSource = new BehaviorSubject<any>(null);
 private selectedHotelSource = new BehaviorSubject<Hotel | null>(null);
 private selectedRoomSource = new BehaviorSubject<any>(null);

  /*** Search Hotel Component ***/

// Save search details
  setSearchDetails(details: any): void {
    this.searchDetailsSource.next(details);
  }

// Get search details
 getSearchDetails(): Observable<any> {
  return this.searchDetailsSource.asObservable();
}

// get all hotels
getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }


  /*** Hotel Results Component ***/

  /**
   * Fetch hotels filtered by location
   * @param location Location to filter hotels
   * @returns Observable<Hotel[]>
   */
  // getHotelsByLocation(location?: string): Observable<Hotel[]> {
  //   const trimmedLocation = location?.trim().toLowerCase(); // Convert to lowercase
  //   const url = trimmedLocation
  //     ? `${this.apiUrl}?location=${encodeURIComponent(trimmedLocation)}`
  //     : this.apiUrl;
  
  //   console.log('API URL:', url);
  //   return this.http.get<Hotel[]>(url);
  // }
  

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

  /*** Hotel Details Component ***/

// Save selected hotel
setSelectedHotel(hotel: Hotel): void {
  this.selectedHotelSource.next(hotel);
}
getSelectedHotel(): Observable<Hotel | null> {
  return this.selectedHotelSource.asObservable();
}
getHotelById(id: number): Observable<Hotel> {
  return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
}
 /*** Hotel Booking Component ***/
 // Save selected room
 setSelectedRoom(room: any): void {
  this.selectedRoomSource.next(room);
}

// Get selected room
getSelectedRoom(): Observable<any> {
  return this.selectedRoomSource.asObservable();
}

// Booking method to save booking data
bookHotel(bookingData: any): Observable<any> {
  const url = `http://localhost:3000/bookings`; // Booking endpoint in db.json
  return this.http.post<any>(url, bookingData);
}


getBookings(): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3000/bookings`);
}

cancelBooking(id: string): Observable<void> {
  return this.http.delete<void>(`http://localhost:3000/bookings`);
}

giveReview(booking: any): void {
  console.log('Review for booking:', booking);
  // Add review logic here
}

editBooking(booking: any): Observable<any> {
  // Replace with the actual API URL and booking ID
  return this.http.put(`http://localhost:3000/bookings/${booking.hotelid}`, booking);
}

}



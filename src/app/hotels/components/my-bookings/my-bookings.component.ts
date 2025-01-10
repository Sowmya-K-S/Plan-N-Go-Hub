import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHotel, faMapMarkerAlt, faCalendarCheck, faCalendarMinus, faBed, faCircle, faMoneyBill } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  currentBookings: any[] = [];
  pastBookings: any[] = [];

  faHotel = faHotel;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;
  faBed = faBed;
  faCircle = faCircle;
  faMoneyBill = faMoneyBill;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.hotelService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.segregateBookings();
      },
      error: (err) => console.error('Error fetching bookings:', err)
    });
  }

  segregateBookings(): void {
    const today = new Date();

    this.currentBookings = this.bookings.filter((booking) => {
      const checkOutDate = new Date(booking.checkOut);
      return checkOutDate >= today;
    });

    this.pastBookings = this.bookings.filter((booking) => {
      const checkOutDate = new Date(booking.checkOut);
      return checkOutDate < today;
    });
  }

  cancelBooking(id: string): void {
    this.hotelService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter((b) => b.hotelid !== id);
        this.segregateBookings();
        console.log('Booking cancelled successfully');
      },
      error: (err) => console.error('Error cancelling booking:', err)
    });
  }

  giveReview(booking: any): void {
    this.hotelService.giveReview(booking);
  }
}

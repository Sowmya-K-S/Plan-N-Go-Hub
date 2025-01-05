import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Hotel } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.css'
})
export class HotelBookingComponent {

  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  hotel!: Hotel;
  room: any;
  searchDetails: any;
  totalPrice: number = 0;
  gstAmount: number = 0;
  totalPayable: number = 0;
  bookingStatus: string = '';
  bookingDetails: any = {};
  showConfirmation: boolean = false;
  checkIn : any;
  checkOut : any;
  stayDuration : any;

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.hotelService.getSelectedHotel().subscribe((hotel) => (this.hotel = hotel!));
    this.hotelService.getSelectedRoom().subscribe((room) => (this.room = room));
    this.hotelService.getSearchDetails().subscribe((details) => {
      this.searchDetails = details;
      setTimeout(() => {
        this.calculateTotalPrice();
      }, 100);
    });
  }

  calculateTotalPrice() {
    if (this.searchDetails && this.room) {

     this.checkIn = new Date(this.searchDetails.startDate);
     this.checkOut = new Date(this.searchDetails.endDate);
     this.stayDuration = Math.ceil(
        (this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      this.totalPrice = this.stayDuration * this.room.price;
      this.gstAmount = this.totalPrice * 0.18;
      this.totalPayable = this.totalPrice + this.gstAmount;

    }
  }

  onSubmit() {
    const bookingData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      hotelName: this.hotel.name,
      roomType: this.room.type,
      totalPayable: this.totalPayable,

    };

    this.bookingDetails = bookingData;
    

     // Call the service method to save the booking data to db.json
     this.hotelService.bookHotel(bookingData).subscribe(
      (response) => {
        this.bookingStatus = 'Your hotel is booked! You can visit the hotel on the selected dates.';
        console.log('Booking response:', response);
      },
      (error) => {
        this.bookingStatus = 'Failed to book the hotel. Please try again later.';
        console.error('Booking error:', error);
      }
    );

    this.showConfirmation = true;
  }
}



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Hotel } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';

import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.css'
})
export class HotelBookingComponent {

  name!: string;
  age!: string;
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
  stayDuration : number = 0;
  noOfRooms : number = 1;
  otherGuests: { name: string; age: number }[] = [];

  //icons
  faCheckCircle = faCheckCircle;

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.hotelService.getSelectedHotel().subscribe((hotel) => (this.hotel = hotel!));
    this.hotelService.getSelectedRoom().subscribe((room) => (this.room = room));
    this.hotelService.getSearchDetails().subscribe((details) => {
      this.searchDetails = details;
      setTimeout(() => {
        this.calculateTotalPrice();
      }, 100);

      this.initializeGuestFields(details.adults, details.children);

    });
  }

  initializeGuestFields(adults: number, children: number) {
    const totalGuests = adults + children - 1; // Exclude main guest
    this.otherGuests = Array.from({ length: totalGuests }, () => ({ name: '', age: 0 }));
  }

  calculateTotalPrice() {
    if (this.searchDetails && this.room) {

     this.checkIn = new Date(this.searchDetails.startDate);
     this.checkOut = new Date(this.searchDetails.endDate);
     this.stayDuration = Math.ceil(
        (this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      this.noOfRooms = this.searchDetails.rooms;
      this.totalPrice = this.stayDuration * this.room.price * this.noOfRooms;
      this.gstAmount = this.totalPrice * 0.18;
      this.totalPayable = this.totalPrice + this.gstAmount;

    }
  }

  onSubmit(bookingForm: any) {
   
    if (bookingForm.valid) {
  
    const bookingData = {
      hotelid : this.hotel.id,
      hotelName: this.hotel.name,
      hotelImage: this.hotel.images[0],
      location: this.hotel.location,
      name: this.name,
      age: this.age,
      email: this.email,
      phone: this.phone,
      guests: this.otherGuests,
      roomType: this.room.type,
      totalPayable: this.totalPayable,
      checkIn: this.checkIn.toLocaleDateString(),
      checkOut: this.checkOut.toLocaleDateString(),
      status: 'booked',
      rooms: this.noOfRooms,
      stayDuration: this.stayDuration,
    }

    this.bookingDetails = bookingData;
    };

    
    

     // Call the service method to save the booking data to db.json
     this.hotelService.bookHotel(this.bookingDetails).subscribe(
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

  viewDetails() {
    this.router.navigate(['/my-bookings']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  
}
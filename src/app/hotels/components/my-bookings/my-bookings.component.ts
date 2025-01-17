import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHotel, faMapMarkerAlt, faCalendarCheck, faCalendarMinus, faBed, faCircle, faMoneyBill, faCloudMoon, faUsers } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule,  FormsModule, FontAwesomeModule],
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
  faCloudMoon = faCloudMoon;
  faUsers = faUsers;

   // Popup and Review Form State
   showDetailsPopup = false;
   showReviewForm = false;
   selectedBooking: any;
   reviewForm = {
     userName: '',
     rating: null,
     comment: ''
   };

   // Edit Booking State
  showEditPopup = false;
  editForm = {
    hotelName: '',
    location: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    totalPayable: 0
  };

  showRebookPopup = false; // To toggle the "Book Again" popup
rebookForm = {
  hotelName: '',
  location: '',
  checkIn: '',
  checkOut: '',
  roomType: '',
  totalPayable: 0,
};


  constructor(private hotelService: HotelService, privaterouter: Router) {}

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
    //this.openReviewForm(booking);
  }

  // Popup and Review Logic
  openDetailsPopup(booking: any): void {
    this.selectedBooking = booking;
    this.showDetailsPopup = true;
  }

  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.selectedBooking = null;
  }

  openReviewForm(booking: any): void {
    this.selectedBooking = booking;
    this.reviewForm = {
      userName: '',
      rating: null,
      comment: ''
    };
    this.showReviewForm = true;
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
    this.selectedBooking = null;
  }

  submitReview(): void {
    console.log('Review submitted:', {
      booking: this.selectedBooking,
      review: this.reviewForm
    });
    // Logic to handle review submission (e.g., send to backend)
    this.closeReviewForm();
  }

  bookAgain(booking: any): void {
    console.log('Re-booking:', booking);
    // Add logic for re-booking
    // For instance, you might redirect the user to a booking form pre-filled with booking details
    // Populate booking details in a booking form
  const bookingDetails = {
    hotelName: booking.hotelName,
    location: booking.location,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomType: booking.roomType,
    totalPayable: booking.totalPayable,
  };

  // You can decide what to do with bookingDetails:
  // (1) Open a form for editing the booking (similar to openEditPopup),
  // (2) Send the booking details to your service to process rebooking.

  // Example: Re-book by sending booking details directly to the service
  this.hotelService.bookHotel(bookingDetails).subscribe({
    next: () => {
      console.log('Booking completed successfully');
      this.fetchBookings(); // Refresh the list if needed
    },
    error: (err) => {
      console.error('Error rebooking:', err);
    },
  });

  }


 // Edit Booking Logic
 openEditPopup(booking: any): void {
  this.editForm = { ...booking }; // Pre-fill the form with the booking details
  this.showEditPopup = true;
}

closeEditPopup(): void {
  this.showEditPopup = false;
}

submitEditForm(): void {
  console.log('Edited Booking:', this.editForm);

  // Call service to update booking on the server
  this.hotelService.editBooking(this.editForm).subscribe({
    next: () => {
      console.log('Booking updated successfully');
      this.fetchBookings(); // Refresh the bookings list
      this.closeEditPopup();
    },
    error: (err) => console.error('Error updating booking:', err)
  });
}

openRebookPopup(booking: any): void {
  // Pre-fill the form with the booking details
  this.rebookForm = { ...booking };
  this.showRebookPopup = true;
}

closeRebookPopup(): void {
  this.showRebookPopup = false;
}

submitRebookForm(): void {
  console.log('Rebooking with details:', this.rebookForm);

  // Call service to rebook the hotel
  this.hotelService.bookHotel(this.rebookForm).subscribe({
    next: () => {
      console.log('Booking completed successfully');
      this.fetchBookings(); // Refresh the bookings list if needed
      this.closeRebookPopup();
    },
    error: (err) => console.error('Error rebooking:', err),
  });
}


// Cancel Popup State
showCancelPopup = false;

// Open Cancel Popup
openCancelPopup(): void {
  this.showCancelPopup = true;
}

// Close Cancel Popup
closeCancelPopup(): void {
  this.showCancelPopup = false;
}

// Confirm Cancellation
confirmCancellation(): void {
  console.log('Cancellation confirmed.');
  this.closeCancelPopup();
}


}
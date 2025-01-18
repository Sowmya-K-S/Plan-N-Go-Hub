import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHotel, faMapMarkerAlt, faCalendarCheck, faCalendarMinus, faBed, faCircle, faMoneyBill, faCloudMoon, faUsers, faBars, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';



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
  availableRooms: any[] = []; // Store room types fetched from hotel database


  faHotel = faHotel;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarCheck = faCalendarCheck;
  faCalendarMinus = faCalendarMinus;
  faBed = faBed;
  faCircle = faCircle;
  faMoneyBill = faMoneyBill;
  faCloudMoon = faCloudMoon;
  faUsers = faUsers;
  faBars = faBars;
  faClipboardList = faClipboardList;
  faHome = faHome;

   // Popup and Review Form State
   showDetailsPopup = false;
   showReviewForm = false;
   selectedBooking: any;
   reviewForm = {
     username: '',
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
    totalPayable: 0,
    stayDuration: 0,
    name: '', // Main guest's name
    age: null, // Main guest's age
    gender: '', // Main guest's gender
    email: '', // Main guest's email
    phone: '', // Main guest's phone number
    guests: [] as { name: string; age: number | null; gender: string }[], // List of other guests
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


  constructor(private hotelService: HotelService, private router: Router) {}

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
  
    // Filter for current bookings
    this.currentBookings = this.bookings.filter((booking) => {
      //const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      return (
        booking.status === 'booked' && // Status is 'booked'
        checkOutDate >= today // Check-out is in the future or today
      );
    });
  
    // Filter for past bookings
    this.pastBookings = this.bookings.filter((booking) => {
      //const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      return (
        booking.status === 'visited' || // Status is 'visited'
        booking.status === 'cancelled' || // Status is 'cancelled'
        checkOutDate < today // Check-out is in the past
      );
    });
  }
  
  

  cancelBooking(id: string): void {
    const bookingToCancel = this.currentBookings.find((b) => b.id === id);
    if (!bookingToCancel) {
      console.error('Booking not found for cancellation.');
      return;
    }
  
    const updatedBooking = { ...bookingToCancel, status: 'cancelled' };
  
    this.hotelService.cancelBooking(id, updatedBooking).subscribe({
      next: () => {
        this.fetchBookings(); // Refresh bookings after cancellation
        console.log('Booking cancelled successfully');
      },
      error: (err) => console.error('Error cancelling booking:', err)
    });
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
      username: '',
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
    if (!this.selectedBooking) {
      console.error('No booking selected for review.');
      return;
    }
  
    const review = { ...this.reviewForm };
  
    const hotelId = this.selectedBooking.hotelid;
  
    this.hotelService.addReviewToHotel(hotelId, review).subscribe({
      next: () => {
        console.log('Review added successfully');
        this.fetchBookings();
        this.reviewForm = { username: '', rating: null, comment: '' }; // Reset form
        this.showReviewForm = false;
        this.showReviewSuccessPopup = true; // Show success popup
      },
      error: (err) => console.error('Error adding review:', err),
    });
  }
  

  // Add this to the component state
showReviewSuccessPopup = false;
closeReviewSuccessPopup(): void {
  this.showReviewSuccessPopup = false;
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
  this.editForm = {
    hotelName: booking.hotelName,
    location: booking.location,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomType: booking.roomType,
    totalPayable: booking.totalPayable,
    stayDuration: booking.stayDuration || 0,
    name: booking.name,
    age: booking.age,
    gender: booking.gender,
    email: booking.email,
    phone: booking.phone,
    guests: booking.guests ? [...booking.guests] : [], // Clone guest list
  };

  this.hotelService.getRoomTypesByHotelId(booking.hotelid).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms;
      this.showEditPopup = true;
    },
    error: (err) => console.error('Error fetching room types:', err),
  });
}


addGuest(): void {
  this.editForm.guests.push({ name: '', age: null, gender: '' });
}

removeGuest(index: number): void {
  this.editForm.guests.splice(index, 1);
}


onRoomTypeChange(event: Event): void {
  const selectedRoomType = (event.target as HTMLSelectElement).value;
  const room = this.availableRooms.find((r) => r.type === selectedRoomType);
  if (room) {
    this.editForm.roomType = room.type;
    this.editForm.totalPayable = room.price * this.editForm.stayDuration;
  }
}

updatePrice(): void {
  const checkIn = new Date(this.editForm.checkIn);
  const checkOut = new Date(this.editForm.checkOut);
  const stayDuration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const room = this.availableRooms.find((r) => r.type === this.editForm.roomType);

  if (stayDuration > 0 && room) {
    this.editForm.stayDuration = stayDuration;
    this.editForm.totalPayable = room.price * stayDuration;
  }
}


closeEditPopup(): void {
  this.showEditPopup = false;
}

submitEditForm(): void {
  this.hotelService.editBooking(this.editForm).subscribe({
    next: () => {
      console.log('Booking updated successfully');
      this.fetchBookings(); // Refresh bookings
      this.showUpdateSuccessPopup = true;
      this.closeEditPopup();
    },
    error: (err) => {
      console.error('Error updating booking:', err);
      alert('Failed to update booking. Please try again.');
    },
  });
}


showUpdateSuccessPopup = false;

closeUpdateSuccessPopup(): void {
  this.showUpdateSuccessPopup = false;
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
openCancelPopup(booking: any): void {
  this.selectedBooking = booking;
  this.showCancelPopup = true;
}

// Close Cancel Popup
closeCancelPopup(): void {
  this.showCancelPopup = false;
}

// Confirm Cancellation
confirmCancellation(): void {
  if (!this.selectedBooking) {
    console.error('No booking selected for cancellation.');
    return;
  }

  const updatedBooking = { ...this.selectedBooking, status: 'cancelled' };

  this.hotelService.updateBookingStatus(updatedBooking).subscribe({
    next: () => {
      console.log('Booking cancelled successfully');
      this.fetchBookings(); // Refresh bookings to reflect updated status
      this.showCancelPopup = false; // Close the confirmation popup
      this.showCancelSuccessPopup = true; // Show success popup
    },
    error: (err) => console.error('Error cancelling booking:', err),
  });
}


showCancelSuccessPopup = false;

closeCancelSuccessPopup(): void {
  this.showCancelSuccessPopup = false;
}



updatePastBookingStatus(): void {
  const today = new Date();

  this.pastBookings.forEach((booking) => {
    if (booking.status !== 'cancelled') {
      const checkOutDate = new Date(booking.checkOut);
      if (checkOutDate < today && booking.status !== 'visited') {
        const updatedBooking = { ...booking, status: 'visited' };
        this.hotelService.updateBookingStatus(updatedBooking).subscribe({
          next: () => console.log(`Booking ${booking.id} updated to 'visited'.`),
          error: (err) => console.error('Error updating past booking status:', err),
        });
      }
    }
  });
}



getStatusColor(status: string): string {
  switch (status) {
    case 'booked':
      return 'green'; // Active bookings
    case 'visited':
      return 'blue'; // Completed bookings
    case 'cancelled':
      return 'red'; // Cancelled bookings
    default:
      return 'gray'; // Default color for unknown statuses
  }
}



    //toggle functions
    isMenuOpen = false; // To track the toggle state


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }

  navigateToHome(): void {
    this.router.navigate(['/hotels']); // Navigate to home
    this.isMenuOpen = false; // Close the menu after navigation
  }

  navigateToMyBookings(): void {
    this.router.navigate(['/hotels/my-bookings']); // Navigate to my bookings page
    this.isMenuOpen = false; // Close the menu after navigation
  }




}
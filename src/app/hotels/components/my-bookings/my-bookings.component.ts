import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { HotelService } from '../../services/hotel.service';
import { FormsModule} from '@angular/forms'; // Import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHotel, faMapMarkerAlt, faCalendarCheck, faCalendarMinus, faBed, faCircle, faMoneyBill, faCloudMoon, faUsers, faBars, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';
import { NavigationToggleComponent } from '../navigation-toggle/navigation-toggle.component';




@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule,  FormsModule, FontAwesomeModule, NavigationToggleComponent],
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
  
   selectedBooking: any;
   reviewForm = {
     username: '',
     rating: null,
     comment: ''
   };
   
   editForm : any = {};
  
    rebookForm = {
    hotelName: '',
    location: '',
    name: '',
    age: null,
    gender: '',
    email: '',
    phone: '',
    guests: [] as { name: string; age: number; gender: string }[],
    roomType: '',
    roomPrice: 0,
    noOfrooms: 1,
    stayDuration: 0,
    noOfGuests: 1,
    totalPrice: 0,
    totalPayable: 0,
    checkIn: '',
    checkOut: '',
  };
  


  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  
  //--------------------------Other functions section-------------------------------------------------
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
      const checkOutDate = new Date(booking.checkOut);
      return (
        booking.status === 'booked' && // Status is 'booked'
        checkOutDate >= today // Check-out is in the future or today
      );
    });
  
    // Filter for past bookings and update status
    this.pastBookings = this.bookings.filter((booking) => {
      const checkOutDate = new Date(booking.checkOut);
      const isPast = checkOutDate < today;
  
      if (isPast && booking.status !== 'cancelled' && booking.status !== 'visited') {
        const updatedBooking = { ...booking, status: 'visited' };
        this.hotelService.updateBookingStatus(updatedBooking).subscribe({
          next: () => {
            console.log(`Booking ${booking.id} updated to 'visited'.`);
          },
          error: (err) => console.error('Error updating past booking status:', err),
        });
      }
  
      return booking.status === 'visited' || booking.status === 'cancelled' || isPast;
    });
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

  private convertToISODate(date: string): string {
    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

//--------------------------other functions section-------------------------------------------------







//--------------------------Cancel section-------------------------------------------------
  
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

  //--------------------------Cancel section-------------------------------------------------
  



  //--------------------------details section-------------------------------------------------

  // details
  showDetailsPopup = false;
  openDetailsPopup(booking: any): void {
    this.selectedBooking = booking;
    this.showDetailsPopup = true;
  }

  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.selectedBooking = null;
  }

//--------------------------details section-------------------------------------------------





//--------------------------review section-------------------------------------------------
  showReviewForm = false;
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
  

showReviewSuccessPopup = false;
closeReviewSuccessPopup(): void {
  this.showReviewSuccessPopup = false;
}

//--------------------------review section-------------------------------------------------

  



  //--------------------------Edit section-------------------------------------------------
  showEditPopup = false;
 openEditPopup(booking: any): void {
  this.editForm = booking;

  this.hotelService.getRoomTypesByHotelId(booking.hotelid).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms;
      this.showEditPopup = true;
    },
    error: (err) => console.error('Error fetching room types:', err),
  });
}


addGuest(): void {
  if (!this.editForm.guests) {
    this.editForm.guests = [];
  }
  this.editForm.guests.push({ name: '', age: 0, gender: '' });
}

removeGuest(index: number): void {
  if (this.editForm.guests && this.editForm.guests.length > index) {
    this.editForm.guests.splice(index, 1);
  }
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
    const totalPrice = room.price * stayDuration;
    this.editForm.totalPayable = totalPrice + (0.18 * totalPrice);
  }
}


closeEditPopup(): void {
  this.showEditPopup = false;
}

submitEditForm(): void {
  const totalGuests = this.editForm.guests?.length + 1 || 0;
  this.editForm.noOfGuests = totalGuests;
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

//--------------------------Edit section-------------------------------------------------






//--------------------------rebook section-------------------------------------------------
showRebookPopup = false;
openRebookPopup(booking: any): void {
  this.rebookForm = { ...booking }; // Pre-fill the form with existing booking details
  this.hotelService.getRoomTypesByHotelId(booking.hotelid).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms; // Store available rooms
      this.rebookForm.roomType = rooms[0]?.type; // Set default room type if available
      this.showRebookPopup = true; // Show the rebook popup
    },
    error: (err) => console.error('Error fetching room types:', err),
  });
}


closeRebookPopup(): void {
  this.showRebookPopup = false;
}


updateRebookPrice(): void {
  const checkIn = new Date(this.rebookForm.checkIn);
  const checkOut = new Date(this.rebookForm.checkOut);
  const stayDuration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const room = this.availableRooms.find((r) => r.type === this.rebookForm.roomType);

  if (stayDuration > 0 && room) {
    this.rebookForm.stayDuration = stayDuration;
    const totalPrice = room.price * stayDuration;
    this.rebookForm.totalPayable = totalPrice + totalPrice * 0.18; // 18% tax
  }
}

onRebookRoomTypeChange(event: Event): void {
  const selectedRoomType = (event.target as HTMLSelectElement).value;
  const room = this.availableRooms.find((r) => r.type === selectedRoomType);
  if (room) {
    this.rebookForm.roomType = room.type;
    this.rebookForm.roomPrice = room.price;
    this.updateRebookPrice();
  }
}

removeRebookGuest(index: number): void {
  this.rebookForm.guests.splice(index, 1);
}

addRebookGuest(): void {
  this.rebookForm.guests.push({ name: '', age: 0, gender: '' });
}


submitRebookForm(): void {
  // Generate a new unique ID for rebooking
  // const newBookingId = Math.random().toString(36).substr(2, 9); // Generate a random string for ID
  const totalGuests = this.rebookForm.guests?.length + 1 || 0;
  this.rebookForm.noOfGuests = totalGuests;
  
  const newBooking = {
    ...this.rebookForm, // Copy form data
    status: 'booked', // Reset status to 'booked'
    checkIn: this.rebookForm.checkIn,
    checkOut: this.rebookForm.checkOut,
  };

  this.hotelService.bookHotel(newBooking).subscribe({
    next: () => {
      console.log('Rebooking completed successfully');
      this.fetchBookings(); // Refresh the bookings list
      this.showRebookingSuccessPopup = true; // Show success popup
      this.closeRebookPopup(); // Close rebook popup
    },
    error: (err) => {
      console.error('Error during rebooking:', err);
      alert('Rebooking failed. Please try again.');
    },
  });
}


showRebookingSuccessPopup = false;

closeRebookingSuccessPopup(): void {
  this.showRebookingSuccessPopup = false;
}

//--------------------------rebook section-------------------------------------------------





//--------------------------toggle section-------------------------------------------------
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

  //--------------------------toggle section-------------------------------------------------


  

}
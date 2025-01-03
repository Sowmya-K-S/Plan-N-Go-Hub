import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.hotelService.getSelectedHotel().subscribe((data) => {
      if (data) {
        this.hotel = data;
      } else {
        const hotelId = this.route.snapshot.paramMap.get('id');
        if (hotelId) {
          this.fetchHotelDetails(+hotelId);
        }
      }
    });
  }

  fetchHotelDetails(id: number): void {
    this.hotelService.getHotelById(id).subscribe((data) => {
      this.hotel = data;
    });
  }



  getAmenityIcon(amenity: string): string {
    const icons: Record<string, string> = {
      "Outdoor swimming pool": "fas fa-swimming-pool",
      "Spa": "fas fa-spa",
      "Gym": "fas fa-dumbbell",
      "Bar": "fas fa-cocktail",
      "Massage room": "fas fa-hand-sparkles",
      "Restaurant": "fas fa-utensils",
      "Children's pool": "fas fa-baby",
      "Free Wifi": "fas fa-wifi",
      "Karaoke": "fas fa-microphone",
      "Playground": "fas fa-futbol",
      "Free Parking": "fas fa-parking",
      "Lift": "fas fa-elevator",
      "Sauna": "fas fa-hot-tub",
      "Childcare service": "fas fa-child",
      "Luggage storage": "fas fa-suitcase",
      "Conference room": "fas fa-chalkboard-teacher",
      "EV charging station": "fas fa-charging-station",
      "Cleaning Services": "fas fa-broom",
      "Table tennis room": "fas fa-table-tennis",
      "Yoga Retreat": "fas fa-om",
  
      "Non-Smoking": "fas fa-smoking-ban",
      "Smoking Permitted": "fas fa-smoking",
      "Private Bathroom": "fas fa-shower",
      "Bath Tub": "fas fa-bath",
      "Air Conditioning": "fas fa-wind",
      "Balcony": "fas fa-archway",
      "Ocean View": "fas fa-water",
      "Garden View": "fas fa-seedling",
      "Room Service": "fas fa-concierge-bell",
      "City View": "fas fa-city",
      "Mountain View": "fas fa-mountain",
      "Free Breakfast": "fas fa-utensils",
      "Lagoon View": "fas fa-tree",
    };
  
    return icons[amenity] || "fas fa-question-circle"; // Default icon for undefined amenities
  }
  
}

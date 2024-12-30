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
}

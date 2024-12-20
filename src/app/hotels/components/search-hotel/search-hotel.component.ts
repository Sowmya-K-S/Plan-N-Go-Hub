//search-hotel.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css']
})
export class SearchHotelComponent implements OnInit {
  hotels: any[] = [];
  searchParams = {
    location: '',
    startDate: '',
    endDate: '',
    rooms: 1,
    adults: 1,
    children: 0
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels() {
    this.http.get<any[]>('http://localhost:3000/hotels').subscribe(
      (data) => {
        this.hotels = data;
      },
      (error) => {
        console.error('Error fetching hotel data:', error);
        this.hotels = [];
      }
    );
  }

  onSearch() {
    const { location } = this.searchParams;
    this.router.navigate(['/search-results'], { queryParams: { location } });
  }
  
}

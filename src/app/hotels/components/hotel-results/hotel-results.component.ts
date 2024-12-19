// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-hotel-results',
//   templateUrl: './hotel-results.component.html',
//   styleUrls: ['./hotel-results.component.css']
// })
// export class HotelResultsComponent implements OnInit {
//   hotels: any[] = [];
//   location: string = '';

//   constructor(private route: ActivatedRoute, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.location = params['location'] || '';
//       this.fetchHotelsByLocation();
//     });
//   }

//   fetchHotelsByLocation() {
//     this.http.get<any[]>('http://localhost:3000/hotels').subscribe(
//       (data) => {
//         this.hotels = data.filter(hotel => 
//           hotel.location.toLowerCase().includes(this.location.toLowerCase())
//         );
//       },
//       (error) => {
//         console.error('Error fetching hotel data:', error);
//       }
//     );
//   }
// }

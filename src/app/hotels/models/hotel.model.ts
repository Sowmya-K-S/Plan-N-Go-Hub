
//hotel.model.ts

export interface Room {
  type: string;
  bed: string;
  size: string;
  amenities: string[];
  price: number;
  image: string;
  totalRooms: number; //
  availability:{}; //
  capacity: { 
    adults: number;
    children: number;
  };
}

export interface Hotel {
    id: number;
    name: string;
    location: string;
    Address: string;
    price: number;
    images: string[];
    amenities: string[];
    description: string;
    nearbyAttractions: string[];//
    specialOffers: string[]; //
    rooms: Room[];
    surroundings: {
      'Airport':string;
      'Train': string;
      'Bus': string;
    };
    reviews: [
    {
      username: string;
      rating: number;
      comment: string;
    } ];
    rating: number;
    star: number;
    faqs: [
      {
        question: string;
        answer: string;
      }
    ];
  }
  
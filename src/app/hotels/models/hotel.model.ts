
//hotel.model.ts
export interface Hotel {
    id: number;
    name: string;
    location: string;
    price: number;
    images: string[];
    amenities: string[];
    description: string;
    rooms: any[];
  }
  
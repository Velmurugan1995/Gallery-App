import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  images: string[] = [
    'assets/Images/Person_3.png',
    'assets/Images/Person_2.png',
    'assets/Images/Person_4.png',
    'assets/Images/Person_5.png',
  ];

  getGallery():string[] {
    return this.images;
  }
}

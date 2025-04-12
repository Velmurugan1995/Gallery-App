import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { GalleryService } from 'src/app/services/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  images: string[] = [];

  currentIndex:number = 0;
  startX:number = 0;
  isDragging:boolean = false;

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    this.images = this.galleryService.getGallery();
  }

  onTouchStart(event: TouchEvent | MouseEvent):void {
    this.isDragging = true;
    this.startX = this.getPositionX(event);
  }

  onTouchMove(event: TouchEvent | MouseEvent):void {
    if (!this.isDragging) return;
    const currentX = this.getPositionX(event);
    const diffX = currentX - this.startX;

    this.renderer.setStyle(
      this.sliderRef.nativeElement,
      'transform',
      `translateX(${
        -this.currentIndex * 100 + (diffX / window.innerWidth) * 100
      }%)`
    );
  }

  onTouchEnd(event: TouchEvent | MouseEvent):void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const endX = this.getPositionX(event);
    const diff = endX - this.startX;

    if (diff > 50 && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (diff < -50 && this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }

    this.updateSlidePosition();
  }

  getPositionX(event: TouchEvent | MouseEvent): number {
    return event instanceof TouchEvent
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX;
  }

  updateSlidePosition():void {
    const offset = -this.currentIndex * 100;
    this.renderer.setStyle(
      this.sliderRef.nativeElement,
      'transform',
      `translateX(${offset}%)`
    );
  }

  goToSlide(index: number):void {
    this.currentIndex = index;
    this.updateSlidePosition();
  }

  prevSlide():void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlidePosition();
    }
  }

  nextSlide():void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateSlidePosition();
    }
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Doctor } from './doctor.model'; // You'll need to create this interface
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  error = false;
  doctorChunks: Doctor[][] = [];
  visibleDoctors: Doctor[] = [];
  currentIndex = 0;
  isMobileView = false;
  chunkSize = 3;

  // Statikus mapping az orvosok képeinek
  private doctorImagesMapping: { [key: number]: string } = {
    1: './doctor_images/doctor1.jpg',
    2: './doctor_images/doctor9.jpg',
    3: './doctor_images/doctor6.jpg',
    4: './doctor_images/doctor5.jpg',
    5: './doctor_images/doctor4.jpg',
    6: './doctor_images/doctor3.jpg',
    7: './doctor_images/doctor7.jpg',
    8: './doctor_images/doctor8.jpg',
    9: './doctor_images/doctor9.jpg',
    10: './doctor_images/doctor10.jpg',
    11: './doctor_images/doctor11.jpg',
    12: './doctor_images/doctor12.jpg',
    13: './doctor_images/doctor13.jpg',
    14: './doctor_images/doctor14.jpg',
    15: './doctor_images/doctor15.jpg',
  };

  constructor(private http: HttpClient) {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 768;
    this.chunkSize = this.isMobileView ? 1 : 3;
    this.updateVisibleDoctors(); // Frissítjük a látható doktorokat
  }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.http.get<any>('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/doctors/getAllDoctors')
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.doctors = response.result.map((doctor: Doctor) => {
              return {
                ...doctor,
                imageUrl: this.doctorImagesMapping[doctor.id]
              };
            });
            this.updateVisibleDoctors();
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching doctors:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  updateVisibleDoctors(): void {
    this.visibleDoctors = this.doctors.slice(
      this.currentIndex * this.chunkSize,
      (this.currentIndex * this.chunkSize) + this.chunkSize
    );
  }

  // Split doctors into chunks for carousel items
  getDoctorChunks(): Doctor[][] {
    this.doctorChunks = [];
    for (let i = 0; i < this.doctors.length; i += this.chunkSize) {
      this.doctorChunks.push(this.doctors.slice(i, i + this.chunkSize));
    }
    return this.doctorChunks;
  }

  nextSlide(): void {
    const chunkSize = this.getChunkSize();
    if ((this.currentIndex + 1) * chunkSize < this.doctors.length) {
      this.currentIndex++;
      this.updateVisibleDoctors();
      this.updateActiveSlide();
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleDoctors();
      this.updateActiveSlide();
    }
  }

  // Új segédfüggvény a chunk mérethez
  private getChunkSize(): number {
    if (window.innerWidth < 768) {
      return 1
    }
    else {

      return 3;
    }
  }


  // Aktív dia frissítése
  public updateActiveSlide(): void {
    const slides = document.getElementsByClassName('carousel-item');

    // Összes slide inaktívvá tétele
    Array.from(slides).forEach(slide => {
      slide.classList.remove('active');
    });

    // Aktív slide beállítása
    if (slides[this.currentIndex]) {
      slides[this.currentIndex].classList.add('active');
    }

    // Indikátorok frissítése
    this.updateIndicators();
  }

  // Indikátorok frissítése
  private updateIndicators(): void {
    const indicators = document.getElementsByClassName('carousel-indicator');

    Array.from(indicators).forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.removeAttribute('aria-current');
      }
    });
  }

}




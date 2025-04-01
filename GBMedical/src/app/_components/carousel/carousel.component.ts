import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Doctor } from './doctor.model'; // You'll need to create this interface
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  standalone: true,
  imports:[CommonModule],
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  error = false;
  doctorChunks: Doctor[][] = [];
  visibleDoctors: Doctor[] = [];
  currentIndex = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.http.get<any>('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/doctors/getAllDoctors')
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.doctors = response.result;
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
    this.visibleDoctors = this.doctors.slice(this.currentIndex * 3, (this.currentIndex * 3) + 3);

    
  }

  // Split doctors into chunks for carousel items
  getDoctorChunks(): Doctor[][] {
    const chunkSize = 3;
    this.doctorChunks = [];
    for (let i = 0; i < this.doctors.length; i += chunkSize) {
      this.doctorChunks.push(this.doctors.slice(i, i + chunkSize));
    }
    return this.doctorChunks;
  }

  nextSlide(): void {
    if ((this.currentIndex + 1) * 3 < this.doctors.length) {
      this.currentIndex++;
      this.updateVisibleDoctors();
      this.updateActiveSlide();
    }
  }
  
  // Előző dia
  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleDoctors();
      this.updateActiveSlide();
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




import { Component, OnInit } from '@angular/core';
import { Doctor } from './doctor.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})

export class CarouselComponent implements OnInit {
  doctors: Doctor[] = [];
  activeIndex = 0;
  loading = true;
  error = false;

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
            this.loading = false;
          } else {
            this.error = true;
            this.loading = false;
          }
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  getImageUrl(index: number): string {
    /*return `assets/images/doctor${(index % 5) + 1}.jpg`;*/
    return `/doctor.jpg`; // Assuming you have 5 different doctor images
  }

  onSlideChange(direction: 'prev' | 'next'): void {
    if (direction === 'prev') {
      this.activeIndex = this.activeIndex === 0 ? this.doctors.length - 1 : this.activeIndex - 1;
    } else {
      this.activeIndex = this.activeIndex === this.doctors.length - 1 ? 0 : this.activeIndex + 1;
    }
  }
}

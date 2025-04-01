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

  // Split doctors into chunks for carousel items
  getDoctorChunks(): Doctor[][] {
    const chunkSize = 3; // Display 3 doctors per slide
    const chunks = [];
    for (let i = 0; i < this.doctors.length; i += chunkSize) {
      chunks.push(this.doctors.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
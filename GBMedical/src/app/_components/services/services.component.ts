import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Service {
  id: number;
  name: string;
  description: string;
  doctor_names: string[];
  price: number;
  duration: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  selectedService: Service | null = null;
  errorMessage: string = '';

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/services/getAllServices';

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

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.http.get<{ services: Service[] }>(this.apiUrl).subscribe({
      next: (data) => {
        // A mapping-et alkalmazzuk minden egyes service-re
        this.services = data.services.map(service => {
          // Feltételezve, hogy a service id megegyezik az orvos id-vel
          service.imageUrl = this.doctorImagesMapping[service.id];
          return service;
        });
      },
      error: (error) => {
        console.error('Hiba történt az adatok lekérésekor:', error);
        this.errorMessage = 'Nem sikerült betölteni az adatokat.';
      }
    });
  }

  onSelectService(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const serviceName = selectElement.value;
    this.selectedService = this.services.find(service => service.name === serviceName) || null;
  }

  selectService(service: Service): void {
    this.selectedService = service;
  }

  bookService(service: Service): void {
    this.router.navigate(['/booking']);
  }
}
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

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.http.get<{ services: Service[] }>(this.apiUrl).subscribe({
      next: (data) => {
        this.services = data.services;
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
    this.router.navigate(['/booking'], { 
      queryParams: { serviceId: service.id } 
    });
  }
}
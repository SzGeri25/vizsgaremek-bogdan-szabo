import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Service {
  id: number;
  name: string;
  description: string;
  doctor_names: string[];
  price: number;
  duration: number;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

@Component({
  selector: 'app-booking',
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  standalone: true,
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  selectedDoctorId: number | null = null;

  services: Service[] = [];
  selectedService: Service | null = null;
  selectedServiceId: number | null = null;
  errorMessage: string = '';

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/services/getAllServices';
  private apiUrl2 = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/doctors/getAllDoctors';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.fetchServices();
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    fetch(this.apiUrl2)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Hálózati hiba: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.result) {
          this.doctors = data.result; // A doctors tömb a result kulcs alatt érkezik
        } else {
          console.error('Hibás API válasz formátum:', data);
        }
        console.log("API válasz:", data);
      })
      .catch(error => {
        console.error('Hiba történt az orvosok lekérésekor:', error);
      });
  }

  onSelectDoctor(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const doctorId = Number(selectElement.value);
    this.selectedDoctor = this.doctors.find(doctor => doctor.id === doctorId) || null;
    this.selectedDoctorId = doctorId;
    this.router.navigate(['/calendar'], { queryParams: { doctorId: doctorId } });
  }

  fetchServices(): void {
    fetch(this.apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Hálózati hiba: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: { services: Service[] }) => {
        this.services = data.services;
        console.log("Szolgáltatások:", data);
      })
      .catch((error) => {
        console.error('Hiba történt az adatok lekérésekor:', error);
        this.errorMessage = 'Nem sikerült betölteni az adatokat.';
      });
  }

  onSelectService(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const serviceId = Number(selectElement.value);
    console.log("Kiválasztott szolgáltatás id:", serviceId);

    this.selectedService = this.services.find(service => service.id === serviceId) || null;
    this.selectedServiceId = serviceId;

    if (this.selectedService) {
      this.router.navigate(['/calendar'], { queryParams: { serviceId: serviceId } });
    }
  }
}

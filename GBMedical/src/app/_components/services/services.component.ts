import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  errorMessage: string = '';
  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/services/getAllServices';

  constructor() { }

  ngOnInit(): void {
    this.fetchServices();
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
      })
      .catch((error) => {
        console.error('Hiba történt az adatok lekérésekor:', error);
        this.errorMessage = 'Nem sikerült betölteni az adatokat.';
      });
  }
}

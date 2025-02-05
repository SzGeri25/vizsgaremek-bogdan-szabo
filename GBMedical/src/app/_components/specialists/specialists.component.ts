import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Doctor {
    id: number;
    name: string;
    phoneNumber: string;
    bio: string;
    email: string;
}

@Component({
    selector: 'app-specialists',
    imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
    templateUrl: './specialists.component.html',
    styleUrl: './specialists.component.css'
})

export class SpecialistsComponent implements OnInit {
    doctors: Doctor[] = [];
    errorMessage: string = '';
    private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/doctors/getAllDoctors';

    constructor() { }

    async ngOnInit(): Promise<void> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            const data = await response.json();
            // Feltételezzük, hogy az API válasza így néz ki: { result: Doctor[], ... }
            this.doctors = data.result;
            
        } catch (error) {
            console.error('Hiba történt az adatok lekérésekor:', error);
            this.errorMessage = 'Nem sikerült betölteni az adatokat.';
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';
import { HighlightPipe } from '../../highlight.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ChevronUpComponent } from "../chevron-up/chevron-up.component";
import { Router } from '@angular/router';

interface Doctor {
    id: number;
    name: string;
    phoneNumber: string;
    bio: string;
    email: string;
    imageUrl?: string;
}

interface Review {
    createdAt?: string;
    patientName?: string;
    doctorName?: string;
    doctorId: number;
    patientId: number;
    rating: number;
    id?: number;
    reviewText?: string;
}

@Component({
    selector: 'app-specialists',
    templateUrl: './specialists.component.html',
    styleUrls: ['./specialists.component.css'],
    imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule, HighlightPipe, MatFormFieldModule, MatInputModule, MatIconModule, ChevronUpComponent]
})
export class SpecialistsComponent implements OnInit {
    doctors: Doctor[] = [];
    reviews: Review[] = [];
    errorMessage: string = '';
    searchTerm: string = '';

    // Dinamikus szűrt lista getter-je
    get filteredDoctors(): Doctor[] {
        if (!this.searchTerm) {
            return this.doctors;
        }
        const term = this.searchTerm.toLowerCase();
        return this.doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(term) ||
            (doctor.bio && doctor.bio.toLowerCase().includes(term)) ||
            (doctor.email && doctor.email.toLowerCase().includes(term)) ||
            (doctor.phoneNumber && doctor.phoneNumber.toLowerCase().includes(term))
        );
    }

    // A modálok vezérléséhez
    showReviewModal: boolean = false;
    showAddReviewModal: boolean = false;
    selectedDoctorId: number | null = null;

    // Új értékeléshez tartozó változók
    newReviewRating: number = 0;
    newReviewComment: string = '';
    currentPatientId: number | null = null; // Példa: bejelentkezett páciens azonosítója

    private baseUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources';

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

    constructor(private authService: AuthService, private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.currentPatientId = this.authService.getUserId();
        try {
            const response = await fetch(`${this.baseUrl}/doctors/getAllDoctors`);
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);

            // Feltételezzük, hogy az API { result: Doctor[] } formátumban adja vissza az adatokat
            this.doctors = data.result.map((doctor: Doctor) => {
                // Minden orvoshoz hozzárendeljük a képet a mapping alapján, ha nincs mapping akkor az alapértelmezett
                doctor.imageUrl = this.doctorImagesMapping[doctor.id];
                return doctor;
            });
        } catch (error) {
            console.error('Hiba a doktorok lekérésekor:', error);
            this.errorMessage = 'Nem sikerült betölteni az adatokat.';
        }
    }

    async openReviewModal(doctorId: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/reviews/getReviewsByDoctorId/${doctorId}`);
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            const data = await response.json();

            // Az API: { reviews: Review[], ... }
            this.reviews = data.reviews;
            this.selectedDoctorId = doctorId;
            this.showReviewModal = true;
        } catch (error) {
            console.error('Hiba az értékelések lekérésekor:', error);
            this.reviews = []; // Ha hiba van, üres tömb maradjon
            this.selectedDoctorId = doctorId;
            this.showReviewModal = true; // A modálnak ettől függetlenül meg kell nyílnia
        }
    }

    closeReviewModal(): void {
        this.showReviewModal = false;
        this.reviews = [];
        this.selectedDoctorId = null;
    }

    openAddReviewModal(doctorId: number): void {
        this.selectedDoctorId = doctorId;
        this.newReviewRating = 0;
        this.newReviewComment = '';
        this.showAddReviewModal = true;
    }

    closeAddReviewModal(): void {
        this.showAddReviewModal = false;
        this.selectedDoctorId = null;
    }

    setNewReviewRating(rating: number): void {
        this.newReviewRating = rating;
    }

    async submitReview(): Promise<void> {
        if (this.selectedDoctorId === null) {
            return;
        }

        if (!this.currentPatientId) {
            Swal.fire({
                title: 'Jelentkezz be az értékeléshez!',
                icon: 'warning',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Bejelentkezés!',
                cancelButtonText: 'Mégsem',
                customClass: {
                    actions: 'my-actions',
                    cancelButton: 'order-1 right-gap',
                    confirmButton: 'order-2',
                    denyButton: 'order-3',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/login']);
                }
            });
            return;
        }

        const reviewData = {
            doctorId: this.selectedDoctorId,
            patientId: this.currentPatientId,
            rating: this.newReviewRating,
            reviewText: this.newReviewComment
        };

        try {
            const response = await fetch(`${this.baseUrl}/reviews/addReview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            Swal.fire({
                title: "Köszönjük az értékelést!",
                icon: "success"
            });
            this.closeAddReviewModal();
        } catch (error) {
            console.error('Hiba az értékelés elküldésekor:', error);
            this.errorMessage = 'Nem sikerült elküldeni az értékelést.';
        }
    }
}

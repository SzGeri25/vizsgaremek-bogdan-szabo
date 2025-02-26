import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';

interface Doctor {
    id: number;
    name: string;
    phoneNumber: string;
    bio: string;
    email: string;
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
    imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule]
})
export class SpecialistsComponent implements OnInit {
    doctors: Doctor[] = [];
    reviews: Review[] = [];
    errorMessage: string = '';
    private baseUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources';

    // A modálok vezérléséhez
    showReviewModal: boolean = false;
    showAddReviewModal: boolean = false;
    selectedDoctorId: number | null = null;

    // Új értékeléshez tartozó változók
    newReviewRating: number = 0;
    newReviewComment: string = '';
    currentPatientId: number | null = null; // Példa: bejelentkezett páciens azonosítója

    constructor(private authService: AuthService) { }

    async ngOnInit(): Promise<void> {
        this.currentPatientId = this.authService.getUserId();
        try {
            const response = await fetch(`${this.baseUrl}/doctors/getAllDoctors`);
            if (!response.ok) {
                throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            const data = await response.json();
            // Feltételezzük, hogy az API { result: Doctor[] } formátumban adja vissza az adatokat
            this.doctors = data.result;
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
                title: 'Hiba!',
                text: 'Jelentkezz be az értékeléshez!',
                icon: 'error',
                timer: 3000
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
            console.log('Értékelés sikeresen elküldve:', reviewData);
            this.closeAddReviewModal();
        } catch (error) {
            console.error('Hiba az értékelés elküldésekor:', error);
            this.errorMessage = 'Nem sikerült elküldeni az értékelést.';
        }
    }
}

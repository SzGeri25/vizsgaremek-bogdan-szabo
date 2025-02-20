import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = ''; // Az input mező adatát tárolja
  message: string = ''; // Üzenet a felhasználónak

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.email) {
      this.message = 'Kérlek, add meg az email címed!';
      return;
    }

    const requestBody = { email: this.email };
    this.http.post('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/password/forgotPassword', requestBody)
      .subscribe({
        next: () => this.message = 'A visszaállító email elküldve!',
        error: () => this.message = 'Hiba történt, próbáld újra később.'
      });
  }
}

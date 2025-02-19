import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const newPassword = this.changePasswordForm.get('newPassword')?.value;

    // Feltételezzük, hogy a user már be van jelentkezve,
    // így a token és a patientId elérhető a localStorage-ból
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const patientId = userData.id;

    if (!token || !patientId) {
      this.message = 'Hiányzó authentikációs adatok, kérlek jelentkezz be újra!';
      return;
    }

    const url = `http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients/changePassword?patientId=${patientId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });
    const body = { newPassword };

    this.http.put(url, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.message = 'Sikeresen megváltoztattad a jelszavad!';
        } else {
          this.message = 'Valami hiba történt, próbáld újra!';
        }
      },
      error: (error) => {
        console.error('Hiba a jelszó módosítás során:', error);
        this.message = 'Hiba a jelszó módosításában, kérlek próbáld újra később!';
      }
    });
  }
}

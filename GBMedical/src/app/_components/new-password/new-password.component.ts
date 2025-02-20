import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  token: string | null = null;
  email: string | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  onSubmit(): void {
    if (!this.token || !this.email) {
      this.errorMessage = 'Érvénytelen vagy hiányzó token.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek!';
      return;
    }

    const payload = { token: this.token, email: this.email, newPassword: this.newPassword };

    this.http.post('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/password/resetPassword', payload)
      .subscribe({
        next: () => {
          this.successMessage = 'Jelszó sikeresen megváltoztatva!';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: () => {
          this.errorMessage = 'Hiba történt a jelszó módosítása során.';
        }
      });
  }
}

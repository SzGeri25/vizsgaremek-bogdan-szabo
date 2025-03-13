import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  token: string = '';
  verificationStatus: string = 'Verifying token...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // URL query paraméterekből kinyerjük a token-t
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.verifyToken(this.token);
      } else {
        this.verificationStatus = 'Missing verification token.';
      }
    });
  }

  verifyToken(token: string): void {
    const url = `http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/verification/verify`;
    this.http.post<any>(url, { token })
      .subscribe({
        next: (response) => {
          // Siker esetén a backend válasz alapján módosítjuk a státuszt
          this.verificationStatus = response.message || 'Token successfully verified!';
        },
        error: (error) => {
          // Hibakezelés: 400-as vagy egyéb hiba
          if (error.status === 400) {
            // Ellenőrizzük, hogy az error objektumnak van-e message property-je
            this.verificationStatus = error.error?.message + '!' || 'Invalid or expired token!';
          } else {
            this.verificationStatus = 'An error occurred. Please try again later.';
          }
        }
      });
  }

  // Egyszerű ellenőrzés: ha az üzenet tartalmazza a "siker" szót, akkor sikeresnek tekintjük
  isSuccess(): boolean {
    return this.verificationStatus.toLowerCase().includes('siker');
  }

  // Navigálás a /login oldalra
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

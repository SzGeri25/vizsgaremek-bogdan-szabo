import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showModal: boolean = false; // Modális ablak állapota
  showPassword: boolean = false; // Jelszó láthatósága

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      
      Swal.fire({
        title: "Sikeres bejelentkezés!",
        text: "Átirányítás folyamatban...",
        icon: "success"
      });

      // Hívjuk meg a szerver oldali getIsAdmin függvényt
    const isAdmin = await this.authService.getIsAdmin();

    if (isAdmin) {
      setTimeout(() => this.router.navigate(['/admin']), 2000);
    } else {
      setTimeout(() => this.router.navigate(['/home']), 2000);
    }
      
    } catch (error) {
      console.error('Login sikertelen:', error);
    }
  }
  
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  closeModal() {
    this.showModal = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toForgotPassword(): void {
    this.router.navigate(['/forgotPassword']);
  }
}

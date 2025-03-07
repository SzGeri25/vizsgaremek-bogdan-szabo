import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FooterComponent, NavbarComponent, CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: any = {
    password: false,
    passwordConfirmed: false
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmed: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get passwordConfirmed() {
    return this.registerForm.get('passwordConfirmed');
  }

  // Összehasonlítja a jelszót a megerősítéssel
  get passwordsMatch() {
    return this.password?.value === this.passwordConfirmed?.value;
  }

  togglePasswordVisibility(field: string) {
    this.showPassword[field] = !this.showPassword[field];
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid || !this.passwordsMatch) {
      return;
    }

    const registerData = this.registerForm.value;
    try {
      await this.authService.register(registerData);
      Swal.fire({
        title: 'Sikeres regisztráció!',
        icon: 'success'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } catch (error) {
      Swal.fire({
        title: 'Sikertelen regisztráció!',
        icon: 'error'
      });
    }
  }
}

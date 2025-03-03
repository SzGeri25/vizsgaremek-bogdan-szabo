import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../_services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [NavbarComponent, FooterComponent, FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    // Űrlap mezők deklarálása
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Űrlap beküldésekor meghívandó metódus
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault(); // Megakadályozza az alapértelmezett űrlapbeküldést

    // Összeállítjuk az adatobjektumot a backend által elvárt formában
    const patientData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber
    };

    try {
      // Meghívjuk az AuthService register metódusát
      const response = await this.authService.register(patientData);
      Swal.fire({
        title: "Sikeres regisztráció!",
        icon: "success"
      }).then(() => {
        this.router.navigate(['/login']); // Átirányítás a /login oldalra
      });
    } catch (error) {
      Swal.fire({
        title: "Sikertelen regisztráció!",
        icon: "error"
      });
      // Itt kezelheted a hibákat (pl. hibajelzés a felhasználónak)
    }
  }

}

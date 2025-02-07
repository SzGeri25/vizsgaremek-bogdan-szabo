import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../_services/auth.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService) {}

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
      console.log('Regisztráció sikeres:', response);
      // Itt például átirányíthatod a felhasználót a bejelentkezési oldalra vagy más logikát is futtathatsz
    } catch (error) {
      console.error('Regisztráció sikertelen:', error);
      // Itt kezelheted a hibákat (pl. hibajelzés a felhasználónak)
    }
  }

}

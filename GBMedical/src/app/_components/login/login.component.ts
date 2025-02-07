import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../_services/auth.service';


@Component({
  standalone: true,
    selector: 'app-login', // Ezzel standalone lesz!
    imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent, FormsModule], // Szükséges importok
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    try {
      const result = await this.authService.login(this.email, this.password);
      console.log('Sikeres login:', result);
      // Itt kezeld a további logikát (pl. navigáció)
    } catch (error) {
      console.error('Login sikertelen:', error);
    }
  }
}

import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { ContactComponent } from "../contact/contact.component";

@Component({
    selector: 'app-home',
    imports: [NavbarComponent, FormsModule, FooterComponent, LoginComponent, RegisterComponent, CalendarComponent, ContactComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}

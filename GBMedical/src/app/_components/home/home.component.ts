import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
    selector: 'app-home',
    imports: [NavbarComponent, FormsModule, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    animations: [
        // Egyszerű beúszó animáció a komponenselemekhez
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class HomeComponent {

constructor(private router: Router){}

    goToBooking(): void {
        this.router.navigate(['/booking']);
    }
}

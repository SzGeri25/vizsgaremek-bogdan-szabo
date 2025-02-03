import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {

    constructor( private router: Router){};
    toLogin(): void {
        this.router.navigate(['/login']);
    }

    toRegister(): void {
        this.router.navigate(['/register']);
    }

    toSpecialists(): void {
        this.router.navigate(['/specialists']);
    }

    toServices(): void {
        this.router.navigate(['/services']);
    }

    toContact(): void {
        this.router.navigate(['/contact']);
    }

    toHome(): void {
        this.router.navigate(['/home']);
    }
}

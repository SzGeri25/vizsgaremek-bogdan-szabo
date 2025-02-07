import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-navbar',
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    isAuthenticated: boolean = false;


    constructor(private router: Router, private authService: AuthService) { };

    ngOnInit(): void {
        // Feliratkozás az autentikációs állapot változására
        this.authService.isAuthenticated$.subscribe((state: boolean) => {
            this.isAuthenticated = state;
        });
    }

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

    onLogout(): void {
        this.authService.logout();
        this.router.navigate(['/home']);
        // Esetleg navigálhatunk is, pl. a login oldalra
        // this.router.navigate(['/login']);
    }
}

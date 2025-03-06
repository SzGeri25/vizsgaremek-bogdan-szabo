import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
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
    isMenuOpen = false; // Kezdetben zárt menü

    constructor(private router: Router, private authService: AuthService, private eRef: ElementRef) { };

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
    
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.isMenuOpen = false;
        }
    }

    ngOnInit(): void {
        // Feliratkozás az autentikációs állapot változására
        this.authService.isAuthenticated$.subscribe((state: boolean) => {
            this.isAuthenticated = state;
        });
    }

    toCalendar(): void {
        this.router.navigate(['/calendar']);
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

    toBooking(): void {
        this.router.navigate(['/booking']);
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

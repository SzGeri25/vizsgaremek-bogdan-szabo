import { Component, ElementRef, HostListener } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { ChevronUpComponent } from "../chevron-up/chevron-up.component";
import { SpecialistsComponent } from "../specialists/specialists.component";
import { ServicesComponent } from "../services/services.component";
import { ContactComponent } from "../contact/contact.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { BookingComponent } from "../booking/booking.component";
import { start } from '@popperjs/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import { CarouselComponent } from "../carousel/carousel.component";
import { ViewportScroller } from '@angular/common';

interface Service {
    id: number;
    name: string;
    description: string;
    doctor_names: string[];
    price: number;
    duration: number;
  }
  
  interface Doctor {
    id: number;
    name: string;
    specialty: string;
  }

@Component({
    selector: 'app-home',
    imports: [NavbarComponent, FormsModule, FooterComponent, ChevronUpComponent, SpecialistsComponent, CommonModule, ServicesComponent, ContactComponent, CalendarComponent, BookingComponent, CarouselComponent],
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
    doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  selectedDoctorId: number | null = null;

  services: Service[] = [];
  selectedService: Service | null = null;
  selectedServiceId: number | null = null;
  errorMessage: string = '';

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/services/getAllServices';
  private apiUrl2 = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/doctors/getAllDoctors';



    isAuthenticated: boolean = false;
    isMenuOpen = false; // Kezdetben zárt menü
    isNavbarVisible = true; // Navbar láthatóságának állapota
    private lastScrollPosition = 0; // Utolsó görgetési pozíció

constructor(private router: Router, private authService: AuthService, private eRef: ElementRef, private viewportScroller: ViewportScroller){}

    goToBooking(): void {
        this.router.navigate(['/booking']);
    }

toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
    
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.isMenuOpen = false;
        }
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar elrejtése/felfedése
    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 50 && !this.isMenuOpen) {
      this.isNavbarVisible = false; // Lefelé görgetés: eltűnik
    } else {
      this.isNavbarVisible = true; // Felfelé görgetés: megjelenik
    }

    this.lastScrollPosition = currentScrollPosition;
  }


    ngOnInit(): void {
        // Feliratkozás az autentikációs állapot változására
        this.authService.isAuthenticated$.subscribe((state: boolean) => {
            this.isAuthenticated = state;
            this.fetchServices();
            this.fetchDoctors();
        });
    }

    fetchDoctors(): void {
        fetch(this.apiUrl2)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data && data.result) {
              this.doctors = data.result; // A doctors tömb a result kulcs alatt érkezik
            } else {
              console.error('Hibás API válasz formátum:', data);
            }
            console.log("API válasz:", data);
          })
          .catch(error => {
            console.error('Hiba történt az orvosok lekérésekor:', error);
          });
      }

      onSelectDoctor(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const doctorId = Number(selectElement.value);
        this.selectedDoctor = this.doctors.find(doctor => doctor.id === doctorId) || null;
        this.selectedDoctorId = doctorId;
        this.router.navigate(['/calendar'], { queryParams: { doctorId: doctorId } }).then(() =>{
          this.viewportScroller.scrollToPosition([0, 0]);
        });;
      }
    
      fetchServices(): void {
        fetch(this.apiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Hálózati hiba: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data: { services: Service[] }) => {
            this.services = data.services;
            console.log("Szolgáltatások:", data);
          })
          .catch((error) => {
            console.error('Hiba történt az adatok lekérésekor:', error);
            this.errorMessage = 'Nem sikerült betölteni az adatokat.';
          });
      }
    
      onSelectService(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const serviceId = Number(selectElement.value);
        console.log("Kiválasztott szolgáltatás id:", serviceId);
    
        this.selectedService = this.services.find(service => service.id === serviceId) || null;
        this.selectedServiceId = serviceId;
    
        if (this.selectedService) {
          this.router.navigate(['/calendar'], { queryParams: { serviceId: serviceId } }).then(() =>{
            this.viewportScroller.scrollToPosition([0, 0]);
          });;
        }
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
        this.router.navigate(['/login']);
    }


    scrollToSection(): void {
        const bookingButton = document.getElementById("bookingButton") as HTMLButtonElement;
        const targetSection = document.getElementById("idopontfoglalas") as HTMLElement;

        bookingButton.addEventListener("click", () =>{
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: start,
            })
        });
    }
    
    scrollToContact(): void {
        const contactButton = document.getElementById("contactButton") as HTMLButtonElement;
        const targetSection = document.getElementById("kapcsolat") as HTMLElement;

        contactButton.addEventListener("click", () =>{
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: start,
                
            })
        });
    }

    scrollToBooking(): void {
        const bookingButton = document.getElementById("bookingButton") as HTMLButtonElement;
        const targetSection = document.getElementById("idopontfoglalas") as HTMLElement;

        bookingButton.addEventListener("click", () =>{
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: start,
            })
        });
    }

    scrollToBooking2(): void {
        const bookingButton2 = document.getElementById("bookingButton2") as HTMLButtonElement;
        const targetSection = document.getElementById("idopontfoglalas") as HTMLElement;

        bookingButton2.addEventListener("click", () =>{
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: start,
            })
        });
    }

    
}

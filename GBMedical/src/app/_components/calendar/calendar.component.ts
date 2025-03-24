import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NavbarComponent } from '../navbar/navbar.component';
import { lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsModalComponent, EventDetailsData } from '../event-details-modal/event-details-modal.component';
import { AppointmentService } from '../../_services/appointments.service';
import { ServicesComponent } from '../services/services.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';
import { ChevronUpComponent } from "../chevron-up/chevron-up.component";

interface Service {
  id: number;
  name: string;
  description: string;
  doctor_names: string[];
  price: number;
  duration: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, NavbarComponent, MatDialogModule, FormsModule, CommonModule, FooterComponent, ChevronUpComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookedEvents: any[] = [];
  availableEvents: any[] = [];
  doctorId: number | null = null;
  serviceId: number | null = null; // Új property a service ID tárolására

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'hu',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
      today: 'Ma',
      month: 'Hónap',
      week: 'Hét',
      day: 'Nap'
    },
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  private bookedApiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getBookedAppointments';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    // Query paraméterek lekérése: várhatóan ?doctorId=14 vagy ?serviceId=14
    this.route.queryParamMap.subscribe(params => {
      if (params.has('doctorId')) {
        this.doctorId = Number(params.get('doctorId'));
        console.log('Lekért orvos ID:', this.doctorId);
      }
      if (params.has('serviceId')) {
        this.serviceId = Number(params.get('serviceId'));
        console.log('Lekért szolgáltatás ID:', this.serviceId);
      }
    });

    await this.fetchBookedAppointments();
    await this.loadAvailableAppointments();
    this.updateCalendarEvents();
  }

  async fetchBookedAppointments(): Promise<void> {
    try {
      const response = await fetch(this.bookedApiUrl);
      if (!response.ok) {
        throw new Error(`Hálózati hiba: ${response.statusText}`);
      }
      const responseData = await response.json();

      console.log("Foglalt időpontok: ", responseData);

      if (responseData && responseData.status === 'success' && responseData.appointments) {
        this.bookedEvents = responseData.appointments.map((appointment: any) => ({
          id: appointment.id,
          title: `${appointment.doctorName} (${appointment.patientName})`,
          start: appointment.startTime,
          end: appointment.endTime,
          backgroundColor: 'blue',
          borderColor: 'blue',
          extendedProps: {
            status: appointment.status,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            serviceName: appointment.serviceName,
          }
        }));
      } else {
        console.error('Nem megfelelő API válasz (foglalások):', responseData);
      }
    } catch (error) {
      console.error('Hiba történt a foglalt időpontok lekérése során:', error);
    }
  }

  async loadAvailableAppointments(): Promise<void> {
    if (!this.doctorId && !this.serviceId) {
      console.error('Nincs orvos vagy szolgáltatás ID az URL-ben!');
      return;
    }

    try {
      let response: any;
      // Ha van serviceId, akkor a getAvailableSlotsByService endpointot hívjuk
      if (this.serviceId) {
        response = await lastValueFrom(this.appointmentService.getAvailableSlotsByService(this.serviceId));
      } else if (this.doctorId) {
        response = await lastValueFrom(this.appointmentService.getAvailableSlotsByDoctor(this.doctorId));
      }
      if (response.status === 'success') {
        console.log('Lekért szabad időpontok:', response.slots);
        this.availableEvents = response.slots.map((slot: any) => ({
          title: this.serviceId
            ? `${slot.doctorName} - ${slot.serviceName}`
            : `${slot.serviceName} - ${slot.doctorName}`,
          start: this.convertToLocalISOString(slot.slotStart),
          end: this.convertToLocalISOString(slot.slotEnd),
          backgroundColor: 'lightgreen',
          borderColor: 'lightgreen',
          extendedProps: {
            doctorId: slot.doctorId,
            serviceName: slot.serviceName,
            doctorName: slot.doctorName
          }
        }));
      } else {
        console.error('Nincs találat vagy hiba történt (szabad időpontok):', response);
      }
    } catch (error) {
      console.error('Hiba a szabad időpontok lekérése során:', error);
    }
  }

  updateCalendarEvents() {
    const combinedEvents = [...this.bookedEvents, ...this.availableEvents];
    this.calendarOptions = {
      ...this.calendarOptions,
      events: combinedEvents
    };

    setTimeout(() => {
      this.calendarOptions = { ...this.calendarOptions };
    }, 100);
  }

  /**
   * Átalakítja a bejövő időpontot úgy, hogy a helyi időt tükrözze.
   */
  convertToLocalISOString(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      console.error("Hibás dátumformátum:", dateInput);
      return "";
    }

    const tzoffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzoffset);
    return localDate.toISOString().slice(0, 19).replace('T', ' ');
  }

  handleEventClick(info: any): void {
    if (this.doctorId === null && this.serviceId === null) {
        console.error('Nincs orvos vagy szolgáltatás ID elérhető!');
        return;
    }

    const startTime: string = info.event.start ? this.convertToLocalISOString(info.event.start) : '';
    const endTime: string = info.event.end ? this.convertToLocalISOString(info.event.end) : '';

    // Itt a változás: serviceId alapján is kezeljük a foglalást
    const doctorId: number | null = info.event.extendedProps?.doctorId || this.doctorId;
    const patientId: number | null = this.authService.getUserId();

    if (!patientId) {
        Swal.fire({
            title: 'Jelentkezz be a foglaláshoz!',
            icon: 'error',
            timer: 3000
        });
        return;
    }

    const isOwner = patientId === info.event.extendedProps?.patientId;
    const isBooked = info.event.backgroundColor === 'blue';

    if (isBooked) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('appointmentId', info.event.id.toString());
        currentUrl.searchParams.set('patientId', patientId.toString());
        window.history.pushState(null, '', currentUrl.toString());
    }

    const data: EventDetailsData = {
        title: info.event.title,
        start: startTime,
        end: endTime,
        status: info.event.extendedProps?.status,
        doctorId: doctorId!,
        patientId: patientId,
        serviceName: info.event.extendedProps?.serviceName || 'Nincs megadva',
        doctorName: info.event.extendedProps?.doctorName || 'Nincs megadva',
        allowCancellation: isOwner,
        appointmentId: info.event.id
    };

    const dialogRef = this.dialog.open(EventDetailsModalComponent, {
        data,
        width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { bookAppointment: boolean, cancelAppointment: boolean }) => {
        if (result?.bookAppointment) {
            const appointment = {
                doctorId: doctorId,
                patientId: patientId,
                startTime: startTime,
                endTime: endTime,
            };

            this.appointmentService.addAppointmentWithNotification(appointment).subscribe({
                next: response => {
                    console.log('Foglalás sikeres:', response);
                    Swal.fire({
                        title: 'Sikeres foglalás!',
                        text: 'Az időpontot sikeresen lefoglaltad.',
                        icon: 'success',
                        timer: 3000
                    });
                    this.fetchBookedAppointments().then(() => this.updateCalendarEvents());
                },
                error: error => {
                    console.error('Foglalás hiba:', error);
                    Swal.fire({
                        title: 'Hiba!',
                        text: 'Nem sikerült a foglalás. Próbáld újra később!',
                        icon: 'error',
                        timer: 3000
                    });
                }
            });
        }
    });
}
}

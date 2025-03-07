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
  imports: [FullCalendarModule, NavbarComponent, MatDialogModule, FormsModule, CommonModule, FooterComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookedEvents: any[] = [];
  availableEvents: any[] = [];
  doctorId: number | null = null;

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
    this.route.paramMap.subscribe(params => {
      this.doctorId = Number(params.get('id'));
      console.log('Lekért orvos ID:', this.doctorId);
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

      if (responseData && responseData.status === 'success' && responseData.appointments) {
        this.bookedEvents = responseData.appointments.map((appointment: any) => ({
          id: appointment.id,
          title: `${appointment.patientName} (${appointment.doctorName})`,
          start: appointment.startTime,
          end: appointment.endTime,
          backgroundColor: 'blue',
          borderColor: 'blue',
          extendedProps: {
            status: appointment.status,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId
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
    if (!this.doctorId) {
      console.error('Nincs orvos ID az URL-ben!');
      return;
    }

    try {
      const response = await lastValueFrom(this.appointmentService.getAvailableSlots(this.doctorId));
      if (response.status === 'success') {
        console.log('Lekért szabad időpontok:', response.slots);
        this.availableEvents = response.slots.map((slot: any) => ({
          title: 'Orvos ' + slot.doctorId + ' (szabad)',
          start: this.convertToISO(slot.slotStart),
          end: this.convertToISO(slot.slotEnd),
          backgroundColor: 'lightgreen',
          borderColor: 'lightgreen',
          extendedProps: {
            doctorId: slot.doctorId
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

  convertToISO(dateStr: string): string {
    const parsedDate = new Date(dateStr);
  
    if (isNaN(parsedDate.getTime())) {
      console.error("Hibás dátumformátum:", dateStr);
      return "";
    }
  
    return parsedDate.toISOString().slice(0, 19); // Levágja a `Z` végződést
  }
  
  

  handleEventClick(info: any): void {
    if (this.doctorId === null) {
      console.error('Nincs orvos ID elérhető!');
      return;
    }

    const startTime: string = info.event.start ? this.convertToISO(info.event.start.toISOString()) : '';
    const endTime: string = info.event.end ? this.convertToISO(info.event.end.toISOString()) : '';

    const doctorId: number = this.doctorId;
    const patientId: number | null = this.authService.getUserId();

    if (!patientId) {
      Swal.fire({
        title: 'Hiba!',
        text: 'Jelentkezz be a foglaláshoz!',
        icon: 'error',
        timer: 3000
      });
      return;
    }

    const data: EventDetailsData = {
      title: info.event.title,
      start: info.event.start ? info.event.start.toISOString().replace('T', ' ').slice(0, 19) : '',
      end: info.event.end ? info.event.end.toISOString().replace('T', ' ').slice(0, 19) : '',
      status: info.event.extendedProps?.status,
      doctorId: doctorId,
      patientId: patientId
    };
    

    const dialogRef = this.dialog.open(EventDetailsModalComponent, {
      data,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: { bookAppointment: boolean }) => {
      if (result && result.bookAppointment) {
        const appointment = {
          doctorId: doctorId,
          patientId: patientId,
          startTime: startTime,
          endTime: endTime
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar modul importálása
import { CalendarOptions } from '@fullcalendar/core';       // Típusellenőrzéshez
import dayGridPlugin from '@fullcalendar/daygrid';         // DayGrid plugin
import { NavbarComponent } from '../navbar/navbar.component';
import { lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsModalComponent, EventDetailsData } from '../event-details-modal/event-details-modal.component';
import { AppointmentService } from '../../_services/appointments.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, NavbarComponent, MatDialogModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // Külön eseménytömbök a foglalt és szabad időpontokhoz
  bookedEvents: any[] = [];
  availableEvents: any[] = [];

  // A naptár beállításai
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
    eventClick: this.handleEventClick.bind(this) // Eseményre kattintás kezelés
  };

  private bookedApiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getBookedAppointments';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) { }

  async ngOnInit(): Promise<void> {
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
        this.bookedEvents = responseData.appointments.map((appointment: any) => {
          // A backend ISO formátumú dátumokat ad vissza
          return {
            id: appointment.id,
            title: `${appointment.patientName} (${appointment.doctorName})`,
            start: appointment.startTime,
            end: appointment.endTime,
            backgroundColor: 'blue', // Foglalt: kék
            borderColor: 'blue',
            extendedProps: {
              doctorId: appointment.doctorId,
              patientId: appointment.patientId,
              status: appointment.status
            }
          };
        });
      } else {
        console.error('Nem megfelelő API válasz (foglalások):', responseData);
      }
    } catch (error) {
      console.error('Hiba történt a foglalt időpontok lekérése során:', error);
    }
  }

  async loadAvailableAppointments(): Promise<void> {
    // Ezeket az értékeket a példában a következőképp adjuk meg:
    const doctorId = 10;
    const startDate = '2025-02-19 09:00:00';
    const endDate = '2025-02-19 17:00:00';

    try {
      const response = await lastValueFrom(this.appointmentService.getAvailableSlots(doctorId, startDate, endDate));
      if (response.status === 'success') {
        this.availableEvents = response.slots.map((slot: any) => {
          return {
            title: 'Orvos ' + slot.doctorId + ' (szabad)',
            start: this.convertToISO(slot.slotStart),
            end: this.convertToISO(slot.slotEnd),
            backgroundColor: 'lightgreen', // Szabad: zöld
            borderColor: 'lightgreen'
          };
        });
      } else {
        console.error('Nincs találat vagy hiba történt (szabad időpontok):', response);
      }
    } catch (error) {
      console.error('Hiba a szabad időpontok lekérése során:', error);
    }
  }

  /**
   * Összevonja a foglalt és szabad időpontokat, majd frissíti a naptárat.
   */
  updateCalendarEvents() {
    const combinedEvents = [...this.bookedEvents, ...this.availableEvents];
    this.calendarOptions = {
      ...this.calendarOptions,
      events: combinedEvents
    };
  }

  /**
   * Konvertálja a backend által adott dátum formátumot ISO formátumra.
   * Példa: "2025-02-18 09:00:00.0"  -> "2025-02-18T09:00:00"
   */
  convertToISO(dateStr: string): string {
    const trimmed = dateStr.split('.')[0];
    return trimmed.replace(' ', 'T');
  }

  // Eseményre kattintás esetén megjelenítjük a részleteket
  handleEventClick(info: any): void {
    const data: EventDetailsData = {
      title: info.event.title,
      start: info.event.start ? info.event.start.toLocaleString() : '',
      end: info.event.end ? info.event.end.toLocaleString() : '',
      status: info.event.extendedProps?.status,
      doctorId: info.event.extendedProps?.doctorId,
      patientId: info.event.extendedProps?.patientId
    };

    this.dialog.open(EventDetailsModalComponent, {
      data,
      width: '400px'
    });
  }
}

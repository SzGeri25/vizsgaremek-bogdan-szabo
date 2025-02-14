import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar modul importálása
import { CalendarOptions } from '@fullcalendar/core';       // Típusellenőrzéshez
import dayGridPlugin from '@fullcalendar/daygrid';         // DayGrid plugin
import { NavbarComponent } from '../navbar/navbar.component';
import { lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsModalComponent, EventDetailsData } from '../event-details-modal/event-details-modal.component';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, NavbarComponent, MatDialogModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

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

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getBookedAppointments';

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    await this.fetchAppointments();
  }

  async fetchAppointments(): Promise<void> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Hálózati hiba: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData && responseData.status === 'success' && responseData.appointments) {
        const events = responseData.appointments.map((appointment: any) => {
          // Mivel a backend már ISO formátumú dátumokat ad, közvetlenül használhatjuk őket
          const startTime = appointment.startTime;
          const endTime = appointment.endTime;

          return {
            id: appointment.id,
            title: `${appointment.patientName} (${appointment.doctorName})`,
            start: startTime,
            end: endTime,
            extendedProps: {
              doctorId: appointment.doctorId,
              patientId: appointment.patientId,
              status: appointment.status
            }
          };
        });

        console.log('Események listája:', events);
        // Frissítjük a naptár opciókat az új eseményekkel
        this.calendarOptions = { ...this.calendarOptions, events };
      } else {
        console.error('Nem megfelelő API válasz:', responseData);
      }
    } catch (error) {
      console.error('Hiba történt az API hívás során:', error);
    }
  }

  // Eseményre kattintás esetén megjelenítjük a részleteket
  handleEventClick(info: any): void {
    const data: EventDetailsData = {
      title: info.event.title,
      start: info.event.start ? info.event.start.toLocaleString() : '',
      end: info.event.end ? info.event.end.toLocaleString() : '',
      status: info.event.extendedProps.status,
      doctorId: info.event.extendedProps.doctorId,
      patientId: info.event.extendedProps.patientId
    };

    this.dialog.open(EventDetailsModalComponent, {
      data,
      width: '400px'
    });
  }
}

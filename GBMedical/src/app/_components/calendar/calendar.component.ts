import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar modul importálása
import { CalendarOptions } from '@fullcalendar/core';       // Típusellenőrzéshez
import dayGridPlugin from '@fullcalendar/daygrid';         // DayGrid plugin
import { NavbarComponent } from '../navbar/navbar.component';
import { lastValueFrom } from 'rxjs';                      // Az RxJS új megoldása

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, NavbarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
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
    events: []
  };

  private apiUrl = 'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/appointments/getBookedAppointments';

  constructor(private http: HttpClient) { }

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
      console.log('API válasz:', responseData); // 🔍 Ellenőrizd az API válaszát!

      if (responseData && responseData.status === 'success' && responseData.appointments) {
        const events = responseData.appointments.map((appointment: any) => {
          console.log('Eredeti startTime:', appointment.startTime); // 🔍 Nézd meg az eredeti dátumot
          console.log('Eredeti endTime:', appointment.endTime);

          // Dátum konvertálás, figyelembe véve a CET időzónát
          const startTime = new Date(appointment.startTime).toISOString();
          const endTime = new Date(appointment.endTime).toISOString();

          console.log('Konvertált startTime:', startTime); // 🔍 Nézd meg a konvertált dátumot
          console.log('Konvertált endTime:', endTime);

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

        console.log('Események listája:', events); // 🔍 Nézd meg az átalakított eseményeket!

        this.calendarOptions = { ...this.calendarOptions, events }; // Objektum frissítés
      } else {
        console.error('Nem megfelelő API válasz:', responseData);
      }
    } catch (error) {
      console.error('Hiba történt az API hívás során:', error);
    }
  }

}

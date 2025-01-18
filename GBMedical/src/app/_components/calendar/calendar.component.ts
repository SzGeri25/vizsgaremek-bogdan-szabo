import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../_services/appointments.service';
import { FullCalendarModule } from '@fullcalendar/angular'; // A szükséges modul importálása
import { CalendarOptions } from '@fullcalendar/core';  // Módosított importálás

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [FullCalendarModule],
  standalone: true,
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = { // Konfigurációs objektum
    initialView: 'dayGridMonth',
    events: [],
  };

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getBookedAppointments().subscribe(data => {
      const events = data.appointments.map((appointment: { patientName: any; doctorName: any; startTime: string | number | Date; endTime: string | number | Date; status: any; }) => ({
        title: `${appointment.patientName} with ${appointment.doctorName}`,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        description: `Status: ${appointment.status}`
      }));

      // Frissítjük a calendarOptions-t az API adatokkal
      this.calendarOptions.events = events;
    });
  }
}

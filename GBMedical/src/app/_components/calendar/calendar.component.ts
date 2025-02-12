import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar modul importálása
import { CalendarOptions } from '@fullcalendar/core';       // Típusellenőrzéshez
import dayGridPlugin from '@fullcalendar/daygrid';            // DayGrid plugin
import interactionPlugin from '@fullcalendar/interaction';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, NavbarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

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
    // Példa események, ezeket később dinamikusan töltheted be az API-ból
    events: [
      { title: 'Esemény 1', date: '2025-02-15' },
      { title: 'Esemény 2', date: '2025-02-20' }
    ]
  };
}

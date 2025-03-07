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
import { ServicesComponent } from '../services/services.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  imports: [FullCalendarModule, NavbarComponent, MatDialogModule, ServicesComponent, FormsModule, CommonModule,],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // Külön eseménytömbök a foglalt és szabad időpontokhoz
  bookedEvents: any[] = [];
  availableEvents: any[] = [];
  doctorId: number | null = null;

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
    private appointmentService: AppointmentService,
    private route: ActivatedRoute 
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
    
    if (!this.doctorId) {
      console.error('Nincs orvos ID az URL-ben!');
      return;
    }

    const startDate = new Date('2025-02-18 09:00:00').toISOString();
    const endDate = new Date('2025-02-18 17:00:00').toISOString();

   try {
      const response = await lastValueFrom(this.appointmentService.getAvailableSlots(this.doctorId, startDate, endDate));
      if (response.status === 'success') {
        console.log('Lekért szabad időpontok:', response.slots);
        this.availableEvents = response.slots.map((slot: any) => ({
          title: 'Orvos ' + slot.doctorId + ' (szabad)',
          start: this.convertToISO(slot.slotStart),
          end: this.convertToISO(slot.slotEnd),
          backgroundColor: 'lightgreen',
          borderColor: 'lightgreen'
        }));
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

    setTimeout(() => {
      this.calendarOptions = { ...this.calendarOptions };
    }, 100);

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

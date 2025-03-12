import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../_services/appointments.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

export interface EventDetailsData {
  title: string;
  start: string;
  end: string;
  status: string;
  doctorId: number;
  patientId: number;
  serviceName: string;
  doctorName: string;
}

@Component({
  selector: 'app-event-details-modal',
  imports: [MatIconModule, CommonModule],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.css'
})
export class EventDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsData,
    private appointmentService: AppointmentService // Szerviz injektálása
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  // Az időpontfoglalás gomb kattintásának kezelése
  onBookingClick(): void {
    console.log('Időpontfoglalás indítása...');

    // Az időpontfoglaláshoz szükséges adatok
    const appointment = {
      doctorId: this.data.doctorId,
      patientId: this.data.patientId,
      startTime: this.data.start,
      endTime: this.data.end,
      status: 'booked'
    };

    // Foglalás elküldése a szervernek
    this.appointmentService.addAppointmentWithNotification(appointment).subscribe({
      next: response => {
        console.log('Foglalás sikeres:', response);
        Swal.fire({
          title: 'Sikeres foglalás!',
          text: 'Az időpontot sikeresen lefoglaltad.',
          icon: 'success',
          timer: 3000
        });
        this.dialogRef.close(); // Modal bezárása sikeres foglalás után
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
}

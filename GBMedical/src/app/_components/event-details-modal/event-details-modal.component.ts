import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


export interface EventDetailsData {
  title: string;
  start: string;
  end: string;
  status: string;
  doctorId: number;
  patientId: number;
}

@Component({
  selector: 'app-event-details-modal',
  imports: [MatIconModule],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.css'
})

export class EventDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  // Az időpontfoglalás gomb kattintásának kezelése
  onBookingClick(): void {
    console.log('Időpontfoglalás gomb megnyomva');
    // Itt egyelőre nem csinálunk semmit
  }
}
